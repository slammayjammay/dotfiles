const postprocessingEffect = require('./effects/film');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
