module.exports = ({ ShaderMaterial }) => {
	const rippleShader = require('./ripple-shader')({ ShaderMaterial });

	return [];
	return [rippleShader];
};
