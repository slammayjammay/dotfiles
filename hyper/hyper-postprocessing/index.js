const postprocessingEffect = require('./effects/nasa-curved-monitor');

module.exports = ({ ShaderMaterial }) => {
	return postprocessingEffect({ ShaderMaterial });
};
