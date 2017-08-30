let clearScreenAndScrollbackFn;

exports.middleware = (store) => (next) => (action) => {
	if (action.type === 'SESSION_CLEAR_ACTIVE') {
		clearScreenAndScrollbackFn && clearScreenAndScrollbackFn();
	}

	next(action);
};

exports.decorateTerm = (Term, { React }) => {
	return class ClearScrollback extends React.Component {
		_onTerminal(term) {
			this.term = term;

			if (this.props.onTerminal) {
				this.props.onTerminal(term);
			}

			clearScreenAndScrollbackFn = this.term.wipeContents.bind(this.term);
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onTerminal: (...args) => this._onTerminal(...args)
			}));
		}
	};
};
