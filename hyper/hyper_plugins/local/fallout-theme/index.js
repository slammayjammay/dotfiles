require('babel-polyfill');
import 'gsap';

// =============================================================================
// Fallout terminal theme.
// 1) Sets the background image to a retro computer screen.
// 2) Colors text as green.
// 3) Animates output, as if being typed to the screen.

// TODO:
// 1) If output is being typed and the user presses a key, skip to the end state
//    of the animation.
// 2) Don't type out individual whitespace characters. Instead, group them.
// =============================================================================

exports.decorateConfig = (config) => {
	return Object.assign({}, config, {
		css: `
			${config.css || ''}

			.fallout .hyper_main {
				background-image: url(http://i.imgur.com/NFc1CXK.jpg) !important;
				background-size: cover;
				background-position: center;
			}
			.fallout .hyper_main::before {
				opacity: 0 !important;
			}
		`,
		termCSS: `
			${config.termCSS || ''}

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
}
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
				this.term.onVTKeystroke('\n');
      } else if (!nextProps.fallout && this.props.fallout) {
				this.disableFallout();
				this.term.onVTKeystroke('\n');
      }
    }

		enableFallout() {
			this.enabled = true;

			this.oldPrefs = {
				fontFamily: this.term.prefs_.get('font-family'),
				fontSize: this.term.prefs_.get('font-size')
			};

			this.term.prefs_.set('font-family', '"Fixedsys Excelsior 3.01"')
			this.term.setFontSize(14);

			// to animate output, we have to capture the text before HTerm prints it
			// to the screen. this way we can control how HTerm scrolls when output
			// is printed.
			// HTerm's #onVTKeystroke and #interpret are called on every keystroke.
			// #interpret is called again for any output that will be printed, so
			// that's where we will intercept it.
			// we will ovewrite these instance methods so that we can capture the
			// output before it is written to the screen.
			// warning: this is done with almost no knowledge of the inner workings of
			// HTerm.

			const self = this;
			let willReceiveOutput = false;

			// override 'onVTKeystroke'
			this.oldKeystroke = this.term.io.onVTKeystroke.bind(this.term.io);
			this.term.io.onVTKeystroke = function(str) {
				willReceiveOutput = false;

				if (str.includes('\r')) {
						willReceiveOutput = true;
						self.oldInterpret('\n\r');
				}

				self.oldKeystroke(str);
			}.bind(this.term.io);

			// override 'interpret'
			this.oldInterpret = this.term.interpret.bind(this.term);
			this.term.interpret = function(str) {
				// intercept the output
				if (willReceiveOutput) {
					self.captureOutput(str);
					return;
				}

				self.oldInterpret(str);
			}.bind(this.term);

			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.enabled = false;
			this.term.prefs_.set('font-family', this.oldPrefs.fontFamily);
			this.term.setFontSize(this.oldPrefs.fontSize);

			this.term.io.onVTKeystroke = this.oldKeystroke;
			this.term.interpret = this.oldInterpret;

			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
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
			return new Promise(async resolve => {
				for (let line of lines) {
					await this.outputLine(line);
					this.oldInterpret('\n\r');
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
				this.oldInterpret(line);
				const text = screen.getLineText_(currentRow);
				const { row, column } = screen.cursorPosition;
				screen.clearCursorRow();
				currentRow.style.opacity = '';

				// print increasingly larger substrings of the line text, updating the
				// cursor as the line gets longer.
				let i = 1;
				const id = setInterval(() => {
					screen.setCursorPosition(row, 0);
					screen.overwriteString(text.slice(0, i + 1));
					screen.setCursorPosition(row, i);
					screen.maybeClipCurrentRow();
					this.term.scheduleSyncCursorPosition_();

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
