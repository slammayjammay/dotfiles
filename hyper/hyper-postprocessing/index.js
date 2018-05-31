const postprocessingEffect = require('./effects/fallout-boy');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
