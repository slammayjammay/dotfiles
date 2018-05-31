const { homedir } = require('os');
const { readFileSync } = require('fs');
const { GlitchPass, DotScreenPass } = require('postprocessing');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/glitch/compiled.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();
	const shaderMaterial = new ShaderMaterial({ fragmentShader });

	return [
		{ shaderPass: new GlitchPass() },
		{ shaderPass: new DotScreenPass() },
		{ shaderMaterial }
	];
};
