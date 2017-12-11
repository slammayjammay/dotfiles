const { parse } = require('url');

const API_KEY = 'x0LpWm6y553EBgxBTLe1QMj2ek5b9hfCQewJr26p';
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const OPTIONS = {
	opacity: 0.3,
	videoDisabled: false,
	fallbackImageURL: 'http://www.baltana.com/files/wallpapers-1/Universe-02885.jpg'
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

exports.decorateHyper = (Hyper, { React }) => {
	class Hypernasa extends React.Component {
		constructor(...args) {
			super(...args);
			this.fetchImage();
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

			// mute the video.
			// directly accessing the video element inside the iframe and muting it
			// does not work, I'm assuming because of some youtube embed javascript.
			// the best way to mute the video is probably to load the external script
			// that gives access to the youtube player API. I don't want to do this.
			// instead, here's some messy logic with a timeout that sets the 'muted'
			// property on the video. seems to work...
			iframe.addEventListener('load', () => {
				const video = iframe.contentDocument.querySelector('video');

				// because we pause the video for a bit, hide the iframe to avoid the
				// thumbnail flash
				iframe.style.opacity = 0;
				video.addEventListener('ended', () => iframe.style.opacity = 0);

				const onPlay = () => {
					// remove the event listener so that it doesn't fire when we play
					// the video below
					video.removeEventListener('play', onPlay);

					video.pause();

					setTimeout(() => {
						video.muted = true;
						video.play();

						// add this listener back after the video plays and fires the 'play'
						// event (hopefully)
						setTimeout(() => {
							video.addEventListener('play', onPlay);
							iframe.style.opacity = '';
						}, 300);
					}, 300);
				};

				video.addEventListener('play', onPlay);
			});

			iframe.setAttribute('src', videoURL);
			return iframe;
		}

		render() {
			return React.createElement(Hyper, Object.assign({}, this.props, {
				customCSS: `
					${this.props.customCSS}

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
				`
			}));
		}
	}

	return Hypernasa;
};
