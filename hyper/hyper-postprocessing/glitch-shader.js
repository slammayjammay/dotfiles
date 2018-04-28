const { GlitchPass, DotScreenPass } = require('postprocessing');

module.exports = () => {
	return [
		{ shaderPass: new GlitchPass() },
		{ shaderPass: new DotScreenPass() }
	];
};
