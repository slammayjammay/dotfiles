exports.decorateTerm = (Term, { React }) => {
	return class extends React.Component {
		constructor(...args) {
			super(...args);

			this._onDecorated = this._onDecorated.bind(this);
		}

		_onDecorated(term) {
			if (this.props.onDecorated) {
				this.props.onDecorated(term);
			}

			if (!term) {
				return;
			}

			// set XTerm terminal as transparent. I think this is okay? the background
			// color set in .hyper.js will still show through.
			setTimeout(() => term.term.setOption('allowTransparency', true), 0);
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onDecorated: this._onDecorated
			}));
		}
	}
};
