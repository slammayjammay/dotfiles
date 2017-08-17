// =============================================================================
// Typed animation for terminal output.
//
// TODO:
// 1) If output is being typed and the user presses a key, skip to the end state
//    of the animation.
// 2) Many things break when output wraps lines.
// =============================================================================

import 'babel-polyfill';
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
				onTerminal: (...args) => this._onTerminal(...args)
			}));
		}
	}

	return VimColorSwitcher;
};
