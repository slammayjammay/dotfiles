// =============================================================================
// Typed animation for terminal output.
//
// TODO:
// 1) If output is being typed and the user presses a key, skip to the end state
//    of the animation.
// 2) Sometimes at the end of outputting, an extra newline will be inserted.
// =============================================================================

import OutputEmitter from './OutputEmitter';

// defaults
const DEFAULT_CONFIG = {
	enabled: true
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
		case 'CONFIG_LOAD':
		case 'CONFIG_RELOAD': {
			const config = Object.assign(
				{}, DEFAULT_CONFIG, action.config.hyperTypedOutput
			);
			return state.set('hyperTypedOutput:enabled', config.enabled);
		}
		case 'HYPER_TYPED_OUTPUT:TOGGLE':
			return state.set('hyperTypedOutput:enabled', !state['hyperTypedOutput:enabled']);
  }
  return state;
};

exports.mapTermsState = (state, map) => {
  return Object.assign(map, {
    'hyperTypedOutput:enabled': state.ui['hyperTypedOutput:enabled']
  });
};

const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    'hyperTypedOutput:enabled': parentProps['hyperTypedOutput:enabled']
  });
};

exports.getTermProps = passProps;
exports.getTermGroupProps = passProps;

exports.decorateTerm = (Term, { React }) => {
	class HyperTypedOutput extends React.Component {
		constructor(...args) {
			super(...args);
			this._capturedOutput = '';
		}

		_onTerminal(term) {
			this.term = term;

      if (this.props.onTerminal) {
				this.props.onTerminal(term);
			}
    }

		componentWillReceiveProps(nextProps) {
			const enabled = 'hyperTypedOutput:enabled';

			if (nextProps[enabled] && !this.props[enabled]) {
				this.enable();
      } else if (!nextProps[enabled] && this.props[enabled]) {
				this.disable();
			}
    }

		async enable() {
			if (this.enabled) {
				return;
			}

			this.enabled = true;

			// enables us to capture the output before it's printed to the screen
			this.outputEmitter = this.outputEmitter || new OutputEmitter(this.term);
			this.outputEmitter.hijack();

			// get the prompt text. useful for detecting when output ends
			this.promptString = await this.getPromptString();

			// clear the screen
			this.term.onVTKeystroke('clear\n');

			// manually enter newline when enter is pressed
			this.outputEmitter.on('enter', () => {
				this.outputEmitter.defaultInterpret('\n\r');
			});

			// intercept output that would be printed to the screen.
			// we will manually enter this output later.
			this.outputEmitter.on('output', string => this.captureOutput(string));
		}

		disable() {
			if (!this.enabled) {
				return;
			}

			this.enabled = false;
			this.outputEmitter.unHijack();
		}

		getPromptString() {
			return new Promise(resolve => {
				const getPromptString = (string) => {
					if (string.includes('$')) {
						const prompt = string.slice(0, string.indexOf('$'));

						this.outputEmitter.removeListener('output', getPromptString);
						resolve(prompt);
					}
				};
				this.outputEmitter.on('output', getPromptString);
				this.term.onVTKeystroke('\n\r');
			});
		}

		captureOutput(string) {
			// alternate screen crap
			if (string.includes('\[?1049h') || string.includes('\[?1049l')) {
				this.outputEmitter.defaultInterpret(string);
				return;
			}

			this._capturedOutput += string;

			if (this.isOutputting) {
				return;
			}

			this.beginReceiveOutputDate = new Date();
			this.isOutputting = true;
			this.output();
		}

		async output() {
			if (this._capturedOutput.length === 0) {
				this.isOutputting = false;

				// we only want the block in the timeout to fire once. when receiving
				// output from HTerm, sometimes there will be an initial wait before
				// this.output is called, and sometimes it will be nearly instantaneous.
				// this is the threshold we wait before triggering the timeout.
				const DELAY = 10;
				if (new Date() - this.beginReceiveOutputDate > DELAY) {
					clearTimeout(this.id);
					this.id = setTimeout(() => this.rewriteCursorRow(), 0);
					this.beginReceiveOutputDate = null;
				}

				return;
			}

			const string = this._capturedOutput;
			this._capturedOutput = '';

			if (!string.includes('\n')) {
				await this.outputLine(string);
			} else {
				const lines = string.split('\n').filter(s => {
					return !(
						// remove all of the following
						s === '' || s === ' '
					);
				});

				// remove any leading carriage returns. we will do this manually.
				if (/^\r$/.test(lines[0])) {
					lines.shift();
				}

				await this.outputLines(lines);
			}

			this.output();
		}

		outputLines(lines) {
			if (lines.length === 0) {
				return Promise.resolve();
			}

			return new Promise(async resolve => {
				for (const line of lines) {
					await this.outputLine(line);
					this.outputEmitter.defaultInterpret('\n\r');
				}

				resolve();
			});
		}

		/**
		 * Somewhat of a misnomer -- it's possible that the string is longer than
		 * the viewport width, in which case we have to wrap it around to the next
		 * line(s). This is easily handled internally by HTerm, but since we want to
		 * control scrolling when we print we have to do it ourselves.
		 *
		 * We also are not outputting the actual string given. We will hand it off
		 * to HTerm first so it can apply styles, etc., and then read it from the
		 * x-row it was printed to.
		 *
		 * @param {string} string - The string to print.
		 */
		async outputLine(string) {
			const screen = this.term.screen_;
			const TextAttributes = screen.textAttributes.constructor;
			const currentRow = screen.cursorRowNode_;

			// hide the row so the text doesn't flash
			currentRow.style.opacity = 0;

			// if the string wraps multiple lines then those lines will be scrolled
			// before their text is animated. a shitty workaround is to trick HTerm's
			// screen into thinking it doesn't have to do this.
			const viewportWidth = this.term.screenSize.width;
			const columnCount = this.term.screen_.columnCount_;
			this.term.screenSize.width = 1000000000;
			this.term.screen_.columnCount_ = 1000000000;
			this.outputEmitter.defaultInterpret(string);
			this.term.screenSize.width = viewportWidth;
			this.term.screen_.columnCount_ = columnCount;

			string = screen.getLineText_(currentRow);

			// not sure why, but we need to clone each child node
			const originalNodes = [].map.call(currentRow.childNodes, el => el.cloneNode(true));
			screen.clearCursorRow();
			currentRow.style.opacity = '';

			// newlines will automatically be taken care of
			if (string === '') {
				return;
			}

			// split up the string into substrings of length viewportWidth
			const substrings = [];
			const substringIndices = [];
			let startIdx = 0;

			while (startIdx < string.length) {
				const substring = string.slice(startIdx, startIdx + viewportWidth);

				substrings.push(substring);
				substringIndices.push(startIdx + substring.length);

				startIdx += substring.length;
			}

			// an array of arrays, with each array containing text element containers
			// occupying the row
			const rows = [];

			// we will insert text element containers into this, and when we encounter
			// a new row we will shove it into "rows" and reset
			let rowEls = [];
			let currentLineIdx = 0;

			originalNodes.forEach(originalNode => {
				const clone = originalNode.cloneNode(true);
				const text = originalNode.textContent;
				let currentLineText = substrings[currentLineIdx];

				if (text.length > currentLineText.length) {
					// this node's text content is too long for the row. split up the
					// clone into two -- one to hold the text that can fit on this row,
					// and one to hold the rest on the next row
					clone.textContent = currentLineText;
					rowEls.push(clone);

					// on to the next line
					rows.push(rowEls);
					rowEls = [];
					currentLineIdx += 1;

					const wrappedClone = originalNode.cloneNode(true);
					wrappedClone.textContent = text.slice(currentLineText.length);
					rowEls.push(wrappedClone);
				} else {
					// remove the current node's textContent from the line
					substrings[currentLineIdx] = currentLineText.slice(text.length);
					rowEls.push(clone);
				}
			});

			// don't forget the last one
			rows.push(rowEls);

			const lastRow = rows.pop();
			for (const rowEls of rows) {
				await this.animateLine(rowEls);
				this.outputEmitter.defaultInterpret('\n\r');
			}

			await this.animateLine(lastRow);
			return Promise.resolve();
		}

		/**
		 * @param {array} rowEls - The text element containers that inhabit this row.
		 */
		async animateLine(rowEls) {
			for (const el of rowEls) {
				const currentRow = this.term.screen_.cursorRowNode_;
				currentRow.appendChild(el);
				await this.animateElementText(el);
			}

			return Promise.resolve();
		}

		animateElementText(el) {
			return new Promise(resolve => {
				const text = el.textContent.split('');
				el.textContent = '';

				const { row, column } = this.term.screen_.cursorPosition;

				let char = '';
				let start = 0;
				let i = 0;
				let currentCharIsWhitespace, lastCharWasWhitespace;

				const id = setInterval(() => {
					currentCharIsWhitespace = /\s/.test(text[i]);

					if (lastCharWasWhitespace && currentCharIsWhitespace) {
						while (/\s/.test(text[i])) {
							i += 1;
						}

						if (i >= text.length - 1) {
							i = text.length;
							currentCharIsWhitespace = /\s/.test(text[i]);
						}
					}

					char += text.slice(start, i).join('');
					el.textContent += char;

					// move the cursor as text is printed
					this.term.screen_.cursorPosition.move(row, column + i);
					this.term.scheduleSyncCursorPosition_();

					lastCharWasWhitespace = currentCharIsWhitespace;

					if (i >= text.length) {
						clearTimeout(id);
						this.term.screen_.cursorPosition.move(row, column + i);
						this.term.scheduleSyncCursorPosition_();
						resolve();
					} else {
						start = i;
						i += 1;
						char = '';
					}
				}, 5);
			});
		}

		/**
		 * When we animate text, we directly manipulate the text content of
		 * <x-row>. If you do this on the row that the cursor is on, for some
		 * reason HTerm will throw a tantrum and not show any text you type to
		 * the terminal.
		 * Solution: check if the last line printed was the prompt (flimsy) and
		 * rewrite textContent using HTerm's API. Unfortunately this means that
		 * any inner element to style text will be removed.
		 */
		rewriteCursorRow() {
			const screen = this.term.screen_;
			const string = screen.cursorRowNode_.textContent;
			screen.clearCursorRow(screen.cursorRowNode_);
			screen.overwriteString(string);
			this.term.scheduleSyncCursorPosition_();
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: (...args) => this._onTerminal(...args)
			}));
		}
	}

	return HyperTypedOutput;
};
