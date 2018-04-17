const { parse } = require('url');

const API_KEY = 'x0LpWm6y553EBgxBTLe1QMj2ek5b9hfCQewJr26p';
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const OPTIONS = {
	opacity: 0.3,
	videoDisabled: false,
	fallbackImageURL: 'http://www.baltana.com/files/wallpapers-1/Universe-02885.jpg'
};

exports.decorateConfig = (config) => {
	return Object.assign({}, config, {
		css: `
		${config.css || ''}

		.hypernasa, .hypernasa-image {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}

		.hypernasa-image {
			background-size: cover;
			background-position: center;
		}

		.hypernasa-iframe {
			border: none;
		}

		// i don't know why Hyper works the way it does sometimes...
		.xterm-viewport {
			background: transparent !important;
		}
		`
	});
};

exports.reduceUI = (state, action) => {
	switch (action.type) {
		case 'CONFIG_LOAD':
		case 'CONFIG_RELOAD': {
			Object.assign(OPTIONS, action.config.hypernasa);
		}
	}

	return state;
};

exports.decorateTerm = (Term, { React }) => {
	class Hypernasa extends React.Component {
		constructor(...args) {
			super(...args);

			this._onDecorated = this._onDecorated.bind(this);

			this.fetchImage();
		}

		_onDecorated(term) {
			// set opacity as > 0 because of silly (IMO) xterm source code
			// https://github.com/xtermjs/xterm.js/blob/d4b75e49092de01beca7628c0e37da6e1eea29ef/src/renderer/BaseRenderLayer.ts#L178-L185
			const textLayer = term.term.renderer._renderLayers[0];
			textLayer.setTransparency(term.term.renderer._terminal, 0.0001);
		}

		fetchImage() {
			fetch(NASA_URL)
				.then(response => response.json())
				.then(({ hdurl, url }) => this.setBackground(hdurl || url))
				.catch(reason => {
					console.warn(reason);
					this.setBackground();
				});
		}

		isVideo(url) {
			// I don't know of a good way to check if the url is a video.
			return /youtube/.test(url);
		}

		setBackground(imageURL = OPTIONS.fallbackImageURL) {
			const hyperMain = document.querySelector('.hyper_main');
			const el = document.createElement('div');
			el.classList.add('hypernasa');
			el.style.opacity = OPTIONS.opacity;

			let backgroundEl;
			if (this.isVideo(imageURL)) {
				if (OPTIONS.videoDisabled) {
					backgroundEl = this.createImageEl(OPTIONS.fallbackImageURL);
				} else {
					backgroundEl = this.createVideoEl(imageURL);
				}
			} else {
				backgroundEl = this.createImageEl(imageURL);
			}

			el.append(backgroundEl);
			hyperMain.prepend(el);
		}

		createVideoEl(videoURL) {
			let el;

			// possibly create different elements based on different video hosts
			if (videoURL.includes('youtube')) {
				el = this._createYoutubeVideoEl(videoURL);
			}

			return el;
		}

		createImageEl(imageURL) {
			const el = document.createElement('div');
			el.classList.add('hypernasa-image');
			el.style.backgroundImage = `url(${imageURL})`;
			return el;
		}

		_createYoutubeVideoEl(videoURL) {
			const iframe = document.createElement('iframe');
			iframe.classList.add('hypernasa-iframe');
			iframe.setAttribute('width', window.innerWidth);
			iframe.setAttribute('height', window.innerHeight);

			const parsedURL = parse(videoURL);
			const additionalParams = ['autoplay=1', 'loop=1', 'controls=0'];

			// looping only works if the parameter "playlist=${video-id}" is given
			try {
				const regexMatch = /embed\/([\w-]*)/.exec(parsedURL.pathname);
				additionalParams.push(`playlist=${regexMatch[1]}`);
			} catch (e) {
				console.warn('Hypernasa internal error: could not parse youtube video id.');
			}

			videoURL += parsedURL.query === null ? '?' : '&';
			videoURL += additionalParams.join('&');

			iframe.style.opacity = 0;

			iframe.addEventListener('load', () => {
				const video = iframe.contentDocument.querySelector('video');

				video.addEventListener('ended', () => iframe.style.opacity = 0);

				// no idea why but the video changes volume for no apparent reason.
				// keep it muted always.
				video.addEventListener('volumechange', () => video.muted = true);

				video.addEventListener('play', async () => {
					video.muted = true;

					// wait a little before showing the video (avoids ugly flashing)
					// for some reason setTimeout callbacks are NEVER called.
					// setTimeout(() => console.log('wtf electron?'), 0);
					for (let i = 0; i < 10; i++) {
						await new Promise(resolve => requestAnimationFrame(resolve));
					}

					iframe.style.opacity = '';
				});
			});

			iframe.setAttribute('src', videoURL);
			return iframe;
		}

		render() {
			return React.createElement(Term, Object.assign({}, this.props, {
				onDecorated: this._onDecorated
			}));
		}
	}

	return Hypernasa;
};
