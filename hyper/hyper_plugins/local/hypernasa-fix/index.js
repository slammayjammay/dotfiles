exports.decorateTerm = (Term, { React }) => {
    return class HypernasaFix extends React.Component {
        _onTerminal(term) {
            this.term = term;

            if (this.props.onTerminal) {
                this.props.onTerminal(term);
            }

            this.fixHypernasa();
        }

        /**
         * When I upgraded Hyper they changed .hyper_main to ._main.
         */
        fixHypernasa() {
            document.querySelector('._main').classList.add('hyper_main');
        }
        
        render() {
            return React.createElement(Term, Object.assign({}, this.props, {
                onTerminal: (...args) => this._onTerminal(...args)
            }));
        }
    };
};