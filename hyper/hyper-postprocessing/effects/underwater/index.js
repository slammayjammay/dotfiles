const { homedir } = require('os');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter } = require('three');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/underwater/compiled.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();

	const shaderMaterial = new ShaderMaterial({
		fragmentShader,
		uniforms: {
			backgroundTexture: { value: null }
		}
	});

	const imagePath = `file://${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/underwater/images/underwater.jpg`;

	new TextureLoader().load(imagePath, texture => {
		texture.minFilter = LinearFilter;
		shaderMaterial.uniforms.backgroundTexture.value = texture;
	});

	return { shaderMaterial };
};
