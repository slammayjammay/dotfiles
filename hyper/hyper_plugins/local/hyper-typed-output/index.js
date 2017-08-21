// =============================================================================
// Typed animation for terminal output.
//
// TODO:
// 1) If output is being typed and the user presses a key, skip to the end state
//    of the animation.
// 2) Many things break when output wraps lines.
// 3) HTerm styles text (bold, colors, etc.) by wrapping them in spans. This is
//    currently ignored, meaning no fanciness :(
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
	class VimColorSwitcher extends React.Component {
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
			this.outputEmitter.on('output', string => {
				this.captureOutput(string);
			});
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
			this._capturedOutput += string;

			if (this.isOutputting) {
				return;
			}

			this.isOutputting = true;
			this.output();
		}

		async output() {
			if (this._capturedOutput.length === 0) {
				this.isOutputting = false;
				return;
			}

			const string = this._capturedOutput;
			this._capturedOutput = '';

			if (!string.includes('\n')) {
				this.outputLine(string);
			} else {
				const lines = string.split('\n').filter(s => s !== '');

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
				const lastLine = lines.pop();

				for (const line of lines) {
					await this.outputLine(line);
					this.outputEmitter.defaultInterpret('\n\r');
				}

				await this.outputLine(lastLine);

				const lastLineIsPrompt = lastLine.indexOf(this.promptString) > -1;
				if (!lastLineIsPrompt) {
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
		 * @param {string} string - The string to print.
		 */
		async outputLine(string) {
			const screen = this.term.screen_;
			const TextAttributes = screen.textAttributes.constructor;
			const startRow = screen.cursorRowNode_;
			const { row, col } = screen.cursorPosition;

			// tricky...the number of columns a string will take up is not equal to
			// the string's length. e.g. tab characters are length 1 but take up
			// around 8 columns.
			// the only way to really find out the column length of a string is to
			// print it to the screen, and then use TextAttributes' nodeWidth().

			// hide the row so the text doesn't flash
			startRow.style.opacity = 0;

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

			string = screen.getLineText_(startRow);
			const stringWidth = TextAttributes.nodeWidth(startRow);

			screen.clearCursorRow();
			startRow.style.opacity = '';

			// newlines will be taken care of
			if (string === '') {
				return;
			}

			// split string up into chunks of viewportWidth at most
			const reg = new RegExp(`.{1,${viewportWidth}}`, 'g');
			let lines = string.match(reg);

			const lastLine = lines.pop();

			for (const line of lines) {
				await this.animateLine(line);
				this.outputEmitter.defaultInterpret('\n\r');
			}

			await this.animateLine(lastLine);
			return Promise.resolve();
		}

		animateLine(line) {
			return new Promise(async resolve => {
				const screen = this.term.screen_;
				const currentRow = screen.cursorRowNode_;

				// print the line so we have access to the text.
				// hide the row right before so the full text doesn't flash before we
				// start the typing animation.
				// currentRow.style.opacity = 0;
				// this.outputEmitter.defaultInterpret(line);
				// const text = screen.getLineText_(currentRow).split('');
				// screen.clearCursorRow();
				// currentRow.style.opacity = '';

				const text = line.split('');


				let char = '';

				// print increasingly larger substrings of the line text, updating the
				// cursor as the line gets longer.
				let start = 0;
				let i = 1;
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

					screen.insertString(char);
					this.term.scheduleSyncCursorPosition_();

					lastCharWasWhitespace = currentCharIsWhitespace;

					if (i >= text.length) {
						clearTimeout(id);
						this.term.scheduleSyncCursorPosition_();
						resolve();
					}

					start = i;
					i += 1;
					char = '';
				}, 5);
			});
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: (...args) => this._onTerminal(...args)
			}));
		}
	}

	return VimColorSwitcher;
};
