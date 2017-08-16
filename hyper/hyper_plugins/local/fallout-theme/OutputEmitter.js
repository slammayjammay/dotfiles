import { EventEmitter } from 'events';

/**
 * Monkey patches hyper's internal HTerm instances so we can have access to
 * output BEFORE they are printend to the screen.
 *
 * Emits two events:
 * 1) enter: when a user presses enter (assumes they enter a command).
 * 2) output: Strings that would have been printed to the terminal but are not.
 */
class OutputEmitter extends EventEmitter {
	constructor(hterm) {
		super();
		this.term = hterm;
	}

	/**
	 * Warning: this is done with almost no knowledge of the inner workings of HTerm.
	 *
	 * To animate output, we have to capture the text before HTerm prints it to
	 * the screen. This way we can control how HTerm scrolls when output is
	 * printed. HTerm's #onVTKeystroke and #interpret are called on every
	 * keystroke. #interpret is called again for any output that will be printed,
	 * so that's where we will intercept it. We will ovewrite these instance
	 * methods so that we can capture the output before it is printed to the
	 * screen.
	 */
	hijack() {
		const self = this;
		let willReceiveOutput = false;

		// override 'onVTKeystroke'
		this.oldKeystroke = this.term.io.onVTKeystroke.bind(this.term.io);
		this.term.io.onVTKeystroke = function(str) {
			willReceiveOutput = false;

			if (str.includes('\r')) {
					willReceiveOutput = true;
					self.emit('enter');
			}

			self.oldKeystroke(str);
		}.bind(this.term.io);

		// override 'interpret'
		this.oldInterpret = this.term.interpret.bind(this.term);
		this.term.interpret = function(str) {
			// intercept the output
			if (willReceiveOutput) {
				self.emit('output', str);
				return;
			}

			self.oldInterpret(str);
		}.bind(this.term);
	}

	unHijack() {
		this.term.io.onVTKeystroke = this.oldKeystroke;
		this.term.interpret = this.oldInterpret;
	}

	defaultInterpret(str) {
		this.oldInterpret(str);
	}
}

export default OutputEmitter;
