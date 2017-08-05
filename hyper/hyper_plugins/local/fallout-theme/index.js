// =============================================================================
// Colors!
// But disable for vim!
// Opening vim will output(?) stuff to the terminal, which is then emitted by
// Hyper. This is how we detect when vim opens and closes.
// =============================================================================

const VIM_OPEN_OUTPUT = /\[\?2004h\[\?1049h\[\?1h\=\[\?2004h/;
const VIM_CLOSE_OUTPUT = /\[\?25l\[\?2004l\[44;1H\[K\[44;1H\[\?2004l\[\?1l>\[\?12l\[\?25h\[\?1049l/;
// for some reason, the terminal does not clear after exiting vim. This variable
// is set in the plugin component, where execute the `clear` command in Hyper.
let clearTerminal;

exports.decorateConfig = (config) => {
	return Object.assign({}, config, {
		cursorColor: 'lightgreen',
		termCSS: `
			${config.termCSS || ''}

			/* stolen from hyper-krftwrk */
			.fallout-theme x-row, .fallout-theme x-row span {
				color: lightgreen;
				text-shadow: 0 0 10px lightgreen;
			}
		`
	});
}

function openingVimEditor(data) {
	return VIM_OPEN_OUTPUT.test(data);
}

function closingVimEditor(data) {
	return VIM_CLOSE_OUTPUT.test(data);
}

exports.middleware = (store) => (next) => (action) => {
  if (action.type === 'SESSION_ADD_DATA') {
    const { data } = action;

    if (openingVimEditor(data)) {
      store.dispatch({
				type: 'OPENING_VIM_EDITOR'
			});
    } else if (closingVimEditor(data)) {
			store.dispatch({
				type: 'CLOSING_VIM_EDITOR'
			});
			next(action);
			clearTerminal();
    } else {
			next(action);
		}
  } else {
		next(action);
	}
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case 'OPENING_VIM_EDITOR':
      return state.set('isVimEditor', true);
		case 'CLOSING_VIM_EDITOR':
			return state.set('isVimEditor', false);
  }
  return state;
};

exports.mapTermsState = (state, map) => {
  return Object.assign(map, {
    isVimEditor: state.ui.isVimEditor
  });
};

const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    isVimEditor: parentProps.isVimEditor
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
      if (this.props.onTerminal) {
				this.props.onTerminal(term);
			}

      this._div = term.div_;
      this._window = term.document_.defaultView;
			this._termBody = term.document_.body;

			this._termBody.classList.add('fallout-theme');

			clearTerminal = () => {
				term.io.onVTKeystroke('clear\n');
			};
    }

		componentWillReceiveProps(nextProps) {
			if (nextProps.isVimEditor && !this.props.isVimEditor) {
				this.disable();
      } else if (!nextProps.isVimEditor && this.props.isVimEditor) {
				this.enable();
      }
    }

		enable() {
			this._termBody.classList.add('fallout-theme');
		}

		disable() {
			this._termBody.classList.remove('fallout-theme');
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: this._onTerminal
			}));
		}
	}

	return VimColorSwitcher;
};
