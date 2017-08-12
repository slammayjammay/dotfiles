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
			this._capturedOutput = [];
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
				console.log('disabling');
				this.disableFallout();
				this.term.onVTKeystroke('\n');
      }
    }

		enableFallout() {
			this.enabled = true;
			this.cursor = this.cursor || this.termBody.querySelector('.cursor-node');

			this.oldPrefs = {
				fontFamily: this.term.prefs_.get('font-family'),
				fontSize: this.term.prefs_.get('font-size')
			};

			this.term.prefs_.set('font-family', '"Fixedsys Excelsior 3.01"')
			this.term.setFontSize(14);

			// to animate output, we have to capture the text before hterm prints it
			// to the screen. once we have it, we can manually call this.term.print(),
			// hopefully.
			// 'onVTKeystroke' and 'interpret' are called on every keystroke.
			// 'interpret' is called again for any output that will be printed, so
			// that's where we will intercept it.
			// it's possible that 'interpret' is called multiple times when printing
			// output, so we have to make sure to capture each interpreted string.

			const self = this;
			let willReceiveOutput = false;

			// override 'onVTKeystroke'
			this.oldKeystroke = this.term.io.onVTKeystroke.bind(this.term.io);
			this.term.io.onVTKeystroke = function(str) {
				willReceiveOutput = false;

				if (str.includes('\n') || str.includes('\r')) {
						willReceiveOutput = true;
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
			const lines = string.split('\n').filter(s => s.length > 0);
			this._capturedOutput.push(...lines);

			if (!this.isOutputting) {
				this.isOutputting = true;
				this.alreadyOutputFirstLine = false;

				// sometimes output will be captured separately -- for example the user
				// may enter a command, and two or more pieces of the output is
				// captured. it's possible that the first piece is captured and printed
				// before the second piece is captured. we don't want this behavior, as
				// it makes it harder to determine if the output is related to the same
				// command.
				// set a minimum amount of time before we reset and essentially begin
				// listening for output again.
				this.MIN_DELAY_BEFORE_RESET = 1000;
				this.start = new Date();

				this.output();
			}
		}

		async output() {
			if (this._capturedOutput.length === 0) {
				const end = new Date();
				const elapsed = end - this.start;

				if (elapsed > this.MIN_DELAY_BEFORE_RESET) {
					this.isOutputting = false;
				} else {
					setTimeout(() => this.output(), 0);
				}
				return;
			}

			const line = this._capturedOutput.shift();

			if (this.alreadyOutputFirstLine) {
				this.oldInterpret('\n\r');
			}

			await this.outputLine(line);
			this.alreadyOutputFirstLine = true;

			this.output();
		}

		outputLine(line) {
			return new Promise(async resolve => {
				await this.animateLine(line);
				resolve();
			});
		}

		animateLine(line) {
			return new Promise(async resolve => {
				if (!this.alreadyOutputFirstLine) {
					return resolve();
				}

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
					this.term.scheduleSyncCursorPosition_();

					if (i >= text.length - 1) {
						clearTimeout(id);
						screen.setCursorPosition(row, i + 1);
						screen.maybeClipCurrentRow();
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
