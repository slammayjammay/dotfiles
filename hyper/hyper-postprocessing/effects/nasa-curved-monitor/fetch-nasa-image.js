const API_KEY = 'x0LpWm6y553EBgxBTLe1QMj2ek5b9hfCQewJr26p';
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
const FALLBACK_URL = 'http://www.baltana.com/files/wallpapers-1/Universe-02885.jpg'

module.exports = () => {
	return new Promise((resolve, reject) => {
		fetch(NASA_URL)
			.then(response => response.json())
			.then(({ hdurl, url }) => {
				if (/youtube/.test(hdurl || url)) {
					resolve(FALLBACK_URL);
				} else {
					resolve(hdurl || url)
				}
			})
			.catch(error => {
				resolve(FALLBACK_URL, error);
			});
	});
};
