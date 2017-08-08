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
			}
			.fallout .hyper_main::before {
				opacity: 0 !important;
			}
		`,
		termCSS: `
			${config.termCSS || ''}

			.fallout x-row, .fallout x-row span {
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
		case 'TOGGLE_FALLOUT':
			return state.set('fallout', !state.fallout);
  }
  return state;
};

exports.mapTermsState = (state, map) => {
  return Object.assign(map, {
    isVimEditor: state.ui.isVimEditor,
    fallout: state.ui.fallout
  });
};

const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    isVimEditor: parentProps.isVimEditor,
    fallout: parentProps.fallout
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
			if (nextProps.fallout && !this.props.fallout) {
				this.enableFallout();
				this.term.onVTKeystroke('\n');
      } else if (!nextProps.fallout && this.props.fallout) {
				this.disableFallout();
				this.term.onVTKeystroke('\n');
      }
    }

		enableFallout() {
			this.mainBody.classList.add('fallout');
			this.termBody.classList.add('fallout');
		}

		disableFallout() {
			this.mainBody.classList.remove('fallout');
			this.termBody.classList.remove('fallout');
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: this._onTerminal
			}));
		}
	}

	return VimColorSwitcher;
};
