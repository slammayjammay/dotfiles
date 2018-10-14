const postprocessingEffect = require('./effects/ripple');

module.exports = () => {
	return postprocessingEffect(...arguments);
};
