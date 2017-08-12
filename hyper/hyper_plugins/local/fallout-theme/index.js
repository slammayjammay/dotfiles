require('babel-polyfill');
import 'gsap';

// =============================================================================
// Fallout terminal theme.
// 1) Sets the background image to a retro computer screen.
// 2) Colors text as green.
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
			// if (this.enabled && nextProps.receivedOutput !== this.props.receivedOutput) {
				// this.output();
			// }

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
			this.cursor = this.cursor || this.termBody.querySelector('.cursor-node');

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

			let willReceiveOutput = false;

			// override 'onVTKeystroke'
			const oldKeystroke = this.term.io.onVTKeystroke.bind(this.term.io);
			this.term.io.onVTKeystroke = function(str) {
				willReceiveOutput = false;

				if (str.includes('\n') || str.includes('\r')) {
						willReceiveOutput = true;
				}

				oldKeystroke(str);
			}.bind(this.term.io);

			const self = this;

			// override 'interpret'
			const interpret = this.term.interpret.bind(this.term);
			this.term.interpret = function(str) {
				// intercept the output
				if (willReceiveOutput) {
					self.captureOutput(str);
					return;
				}

				interpret(str);
			}.bind(this.term);

			this.defaultPrint = interpret;

			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.enabled = false;
			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
		}

		captureOutput(string) {
			const lines = string.split('\n').filter(s => s.length > 0);
			this._capturedOutput.push(...lines);

			if (!this.isOutputting) {
				console.log('start outputting');

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
				this.defaultPrint('\n\r');
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
				// let hterm do whatever it needs to do to print a line
				this.defaultPrint(line);

				// then get the text on that line
				const currentRow = this.term.screen_.cursorRowNode_;
				const text = this.term.screen_.getLineText_(currentRow);

				this.term.screen_.clearCursorRow();
				this.term.screen_.overwriteString(text);
				this.term.screen_.maybeClipCurrentRow();




				resolve();

				// const currentRow = this.term.screen_.cursorRowNode_;
				// const text = currentRow.textContent.split('');
				//
				// currentRow.innerHTML = '';
				//
				// const id = setInterval(() => {
				// 	if (text.length === 0) {
				// 		clearInterval(id);
				// 		resolve();
				// 		return;
				// 	}
				//
				// 	currentRow.innerHTML += text.shift();
				// }, 10);
			});
		}

		// async output() {
		// 	this.outputting = true;
		//
		// 	// get all rows that have text content
		// 	// note this does not include the next prompted line
		// 	const rows = (() => {
		// 		const els = this.termBody.querySelectorAll('x-row');
		//
		// 		// discard all rows before the line the cursor is on.
		// 		const cursorPos = parseFloat(this.cursor.style.top);
		// 		// though the terminal has entered the text, the cursor position hasn't
		// 		// updated?
		// 		const currentRowIdx = (cursorPos + 14) / 14; // divide by font size
		//
		// 		return [].slice.call(els, currentRowIdx).filter(el => el.textContent.length > 0);
		// 	})();
		//
		// 	// the animation for the last row will be special
		// 	const lastRow = rows[rows.length - 1].nextSibling;
		// 	TweenMax.set(lastRow, { opacity: 0 });
		//
		// 	console.log(lastRow);
		//
		// 	// hide all rows and the cursor
		// 	TweenMax.set(rows, { opacity: 0 });
		// 	this.cursor.style.visibility = 'hidden';
		//
		// 	// it seems that writing to a row's textContent removes some listener, or
		// 	// something, somewhere, because text will not appear when typing into the
		// 	// terminal. instead, find another way to do the same animation WITHOUT
		// 	// writing to textContent.
		// 	lastRow.style.position = 'relative';
		//
		// 	const fakeRow = document.createElement('x-row');
		// 	TweenMax.set(fakeRow, {
		// 		position: 'absolute',
		// 		top: '0px',
		// 		left: '0px',
		// 		width: '100%',
		// 		height: '100%',
		// 		opacity: 0
		// 	});
		// 	fakeRow.textContent = lastRow.textContent;
		// 	lastRow.appendChild(fakeRow);
		//
		// 	// animate
		// 	for (const row of rows) {
		// 		await this.outputRow(row);
		// 	}
		//
		// 	await this.outputRow(fakeRow);
		// 	TweenMax.set(lastRow, {
		// 		opacity: 1,
		// 		clearProps: 'all',
		// 		onComplete: () => fakeRow.remove()
		// 	});
		//
		// 	// show the cursor
		// 	this.cursor.style.visibility = '';
		// 	this.cursor.setAttribute('focus', true);
		//
		// 	this.outputting = false;
		// }

		outputRow(row) {
			return new Promise(resolve => {
				const letters = row.textContent.split('');
				row.textContent = '';
				TweenMax.set(row, { opacity: 1 });

				const intervalId = setInterval(() => {
					row.textContent = `${row.textContent}${letters.shift()}`;

					if (letters.length === 0) {
						clearInterval(intervalId);
						resolve();
					}
				}, 50);
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
