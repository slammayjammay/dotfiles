const curvedMonitorShader = require('./curved-monitor-shader');
const createRippleShader = require('./ripple-shader');
const createGlitchShader = require('./glitch-shader');

module.exports = ({ ShaderPass, ShaderMaterial }) => {
	const rippleShader = createRippleShader({ ShaderMaterial });
	const glitchShader = createGlitchShader({ ShaderMaterial });

	// return rippleShader;
	// return [...glitchShader, curvedMonitorShader];
};
