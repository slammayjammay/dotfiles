const postprocessingEffect = require('./effects/glitch');

module.exports = () => {
	return postprocessingEffect(...arguments);
};
