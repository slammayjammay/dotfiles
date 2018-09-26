const postprocessingEffect = require('./effects/chalk');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
