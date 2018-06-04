const postprocessingEffect = require('./effects/space-window');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
