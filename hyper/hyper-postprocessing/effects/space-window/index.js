const { homedir } = require('os');
const { readFileSync } = require('fs');
const { BloomPass } = require('postprocessing');

const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/space-window/compiled.glsl`;
const fragmentShader = readFileSync(fragmentShaderPath).toString();

module.exports = () => {
	return [
		fragmentShader,
		{ shaderPass: new BloomPass({ intensity: 2 }) }
	];
};
