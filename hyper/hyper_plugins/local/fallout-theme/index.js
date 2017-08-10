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

		// lol
		if (/fallout!: command not found/.test(data)) {
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
			// 	setTimeout(() => this.output());
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

			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.enabled = false;
			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
		}

		async output() {
			this.outputting = true;

			// get all rows that have text content
			// note this does not include the next prompted line
			const rows = (() => {
				const els = this.termBody.querySelectorAll('x-row');

				// discard all rows before the line the cursor is on.
				const cursorPos = parseFloat(this.cursor.style.top);
				// though the terminal has entered the text, the cursor position hasn't
				// updated?
				const currentRowIdx = (cursorPos + 14) / 14; // divide by font size

				return [].slice.call(els, currentRowIdx).filter(el => el.textContent.length > 0);
			})();

			// the animation for the last row will be special
			const lastRow = rows[rows.length - 1].nextSibling;
			TweenMax.set(lastRow, { opacity: 0 });

			console.log(lastRow);

			// hide all rows and the cursor
			TweenMax.set(rows, { opacity: 0 });
			this.cursor.style.visibility = 'hidden';

			// it seems that writing to a row's textContent removes some listener, or
			// something, somewhere, because text will not appear when typing into the
			// terminal. instead, find another way to do the same animation WITHOUT
			// writing to textContent.
			lastRow.style.position = 'relative';

			const fakeRow = document.createElement('x-row');
			TweenMax.set(fakeRow, {
				position: 'absolute',
				top: '0px',
				left: '0px',
				width: '100%',
				height: '100%',
				opacity: 0
			});
			fakeRow.textContent = lastRow.textContent;
			lastRow.appendChild(fakeRow);

			// animate
			for (const row of rows) {
				await this.outputRow(row);
			}

			await this.outputRow(fakeRow);
			TweenMax.set(lastRow, {
				opacity: 1,
				clearProps: 'all',
				onComplete: () => fakeRow.remove()
			});

			// show the cursor
			this.cursor.style.visibility = '';
			this.cursor.setAttribute('focus', true);

			this.outputting = false;
		}

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
