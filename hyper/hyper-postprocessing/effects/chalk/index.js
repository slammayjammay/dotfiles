const { homedir } = require('os');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter } = require('three');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/chalk/compiled.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();

	const shaderMaterial = new ShaderMaterial({
		uniforms: {
			noiseTexture: { value: null }
		},
		fragmentShader
	});

	const imagePath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/images/noise.png`;

	new TextureLoader().load(imagePath, texture => {
		texture.minFilter = LinearFilter;
		shaderMaterial.uniforms.noiseTexture.value = texture;
	});

	return { shaderMaterial };
};
