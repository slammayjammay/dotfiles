require('babel-polyfill');
import OutputEmitter from './OutputEmitter';

// =============================================================================
// Fallout terminal theme.
// 1) Sets the background image to a retro computer screen.
// 2) Colors text as green.
// 3) Animates output, as if being typed to the screen.

// TODO:
// 1) If output is being typed and the user presses a key, skip to the end state
//    of the animation.
// 2) Many things break when output overflows lines.
// =============================================================================

exports.decorateConfig = (config) => {
	return Object.assign({}, config, {
		css: `
			${config.css || ''}

			/* Fallout background image */
			.fallout .hyper_main {
				background-image: url(http://i.imgur.com/NFc1CXK.jpg) !important;
				background-size: cover;
				background-position: center;
			}
			.fallout .hyper_main::before {
				opacity: 0 !important; // hypernasa puts an overlay here: disable it.
			}
		`,
		termCSS: `
			${config.termCSS || ''}

			/* Color the cursor and text light green */
			.fallout x-screen, .fallout x-row, .fallout x-row span {
				color: lightgreen !important;
				text-shadow: 0 0 10px lightgreen !important;
			}
			.fallout .cursor-node {
				background-color: lightgreen !important;
				border-color: lightgreen !important;
			}
		`
	});
};

exports.middleware = (store) => (next) => (action) => {
	let shouldDoNextAction = true;

  if (action.type === 'SESSION_ADD_DATA') {
    const { data } = action;

		if (data.includes('\n')) {
			store.dispatch({
				type: 'RECIEVED_OUTPUT'
			});
		}

		// test the data with a regex that does not match itself, so that if a user
		// types a command like "cat ${this_file}" we don't toggle fallout.
		if (/fallout!*: command not found/.test(data)) {
			store.dispatch({
				type: 'TOGGLE_FALLOUT'
			});
			shouldDoNextAction = false;
		}
	}

	if (shouldDoNextAction) {
		next(action);
	}
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
		case 'RECIEVED_OUTPUT':
			return state.set('receivedOutput', !state.receivedOutput);
		case 'TOGGLE_FALLOUT':
			return state.set('fallout', !state.fallout);
  }
  return state;
};

exports.mapTermsState = (state, map) => {
  return Object.assign(map, {
    fallout: state.ui.fallout,
    receivedOutput: state.ui.receivedOutput
  });
};

const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    fallout: parentProps.fallout,
    receivedOutput: parentProps.receivedOutput
  });
};

exports.getTermProps = passProps;
exports.getTermGroupProps = passProps;

exports.decorateTerm = (Term, { React }) => {
	class VimColorSwitcher extends React.Component {
		constructor(...args) {
			super(...args);
			this._onTerminal = this._onTerminal.bind(this);
			this._capturedOutput = '';
		}

		_onTerminal(term) {
			this.term = term;

      if (this.props.onTerminal) {
				this.props.onTerminal(term);
			}

      this._div = term.div_;
      this._window = term.document_.defaultView;

			this.mainBody = document.body;
			this.termBody = term.document_.body;
    }

		componentWillReceiveProps(nextProps) {
			if (nextProps.fallout && !this.props.fallout) {
				this.enableFallout();
      } else if (!nextProps.fallout && this.props.fallout) {
				this.disableFallout();
      }
    }

		async enableFallout() {
			this.enabled = true;

			this.oldPrefs = {
				fontFamily: this.term.prefs_.get('font-family'),
				fontSize: this.term.prefs_.get('font-size')
			};

			this.term.prefs_.set('font-family', '"Fixedsys Excelsior 3.01"')
			this.term.setFontSize(14);

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

			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.enabled = false;
			this.term.prefs_.set('font-family', this.oldPrefs.fontFamily);
			this.term.setFontSize(this.oldPrefs.fontSize);

			this.outputEmitter.unHijack();

			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
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

				for (let line of lines) {
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

		outputLine(line) {
			return new Promise(async resolve => {
				await this.animateLine(line);
				resolve();
			});
		}

		animateLine(line) {
			return new Promise(async resolve => {
				const screen = this.term.screen_;
				const currentRow = screen.cursorRowNode_;

				// print the line so we have access to the text and cursor position.
				// hide the row right before so the full text doesn't flash before we
				// start the typing animation.
				currentRow.style.opacity = 0;
				this.outputEmitter.defaultInterpret(line);
				const text = screen.getLineText_(currentRow);
				const { row, column } = screen.cursorPosition;
				screen.clearCursorRow();
				currentRow.style.opacity = '';

				// print increasingly larger substrings of the line text, updating the
				// cursor as the line gets longer.
				let i = 1;
				let currentCharIsWhitespace, lastCharWasWhitespace;

				const id = setInterval(() => {
					currentCharIsWhitespace = /\s/.test(text[i]);

					if (lastCharWasWhitespace && currentCharIsWhitespace) {
						while (/\s/.test(text[i])) {
							i += 1;
						}

						if (i >= text.length - 1) {
							i = text.length - 1;
							currentCharIsWhitespace = /\s/.test(text[i]);
						}
					}

					screen.setCursorPosition(row, 0);
					screen.overwriteString(text.slice(0, i + 1));
					screen.setCursorPosition(row, i);
					screen.maybeClipCurrentRow();
					this.term.scheduleSyncCursorPosition_();

					lastCharWasWhitespace = currentCharIsWhitespace;

					if (i >= text.length - 1) {
						clearTimeout(id);
						screen.setCursorPosition(row, i + 1);
						resolve();
					}

					i += 1;
				}, 5);
			});
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: this._onTerminal
			}));
		}
	}

	return VimColorSwitcher;
};
