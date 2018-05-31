const { homedir } = require('os');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter } = require('three');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/fallout-boy/fragment.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();

	const options = {
		fragmentShader,
		uniforms: {
			backgroundTexture: { value: null }
		}
	};

	const shaderMaterial = new ShaderMaterial(options);

	const imagePath = `file://${homedir()}/dotfiles/hyper/hyper-postprocessing/images/fallout-boy.jpg`;
	new TextureLoader().load(imagePath, texture => {
		texture.minFilter = LinearFilter;
		shaderMaterial.uniforms.backgroundTexture.value = texture;
	});

	return { shaderMaterial };
};
