// =============================================================================
// Fallout terminal theme.
//
// 1) Sets the background image to a retro terminal screen.
// 2) Colors text and cursor light green.
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

		// test the data with a regex that does not match itself, so that if a user
		// types a command like "cat ${this_file}" we don't toggle fallout.
		if (/fallout!*: command not found/.test(data)) {
			store.dispatch({
				type: 'TOGGLE_FALLOUT'
			});

			// enable "typed-output" plugin
			store.dispatch({
				type: 'TOGGLE_TYPED_OUTPUT'
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
		case 'TOGGLE_FALLOUT':
			return state.set('fallout', !state.fallout);
  }
  return state;
};

exports.mapTermsState = (state, map) => {
  return Object.assign(map, {
    fallout: state.ui.fallout
  });
};

const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    fallout: parentProps.fallout
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

		enableFallout() {
			this.enabled = true;

			this.oldPrefs = {
				fontFamily: this.term.prefs_.get('font-family'),
				fontSize: this.term.prefs_.get('font-size')
			};

			// we must set change the font through HTerm's API so that it can render
			// the cursor properly
			this.term.prefs_.set('font-family', '"Fixedsys Excelsior 3.01"')
			this.term.setFontSize(14);

			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.enabled = false;
			this.term.prefs_.set('font-family', this.oldPrefs.fontFamily);
			this.term.setFontSize(this.oldPrefs.fontSize);

			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: (...args) => this._onTerminal(...args)
			}));
		}
	}

	return VimColorSwitcher;
};
