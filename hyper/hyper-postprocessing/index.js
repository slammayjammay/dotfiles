const postprocessingEffect = require('./effects/underwater');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
