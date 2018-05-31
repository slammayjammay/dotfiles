const { homedir } = require('os');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter } = require('three');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/film/compiled.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();

	// first pass is to blend foreground and background
	const backgroundMaterial = new ShaderMaterial({
		fragmentShader,
		uniforms: {
			backgroundTexture: { value: null }
		}
	});

	// second pass is the film effect
	const filmShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/film/film-pass.glsl`;
	const filmShader = readFileSync(filmShaderPath).toString();

	// load background image
	const imagePath = `file://${homedir()}/dotfiles/hyper/hyper-postprocessing/images/film.jpg`;
	new TextureLoader().load(imagePath, texture => {
		texture.minFilter = LinearFilter;
		backgroundMaterial.uniforms.backgroundTexture.value = texture;
	});

	return [
		{ shaderMaterial: backgroundMaterial },
		filmShader
	];
};
