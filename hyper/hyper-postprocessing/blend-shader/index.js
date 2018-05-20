const { TextureLoader, LinearFilter } = require('three');

const { readFileSync } = require('fs');


module.exports = ({ ShaderMaterial }) => {
	const imagePath = 'file:///Users/Scott/dotfiles/hyper/hyper-postprocessing/images/fallout.jpg';
	const fragmentShader = readFileSync('/Users/Scott/dotfiles/hyper/hyper-postprocessing/blend-shader/fragment-source.glsl').toString();

	const options = {
		uniforms: {
			tDiffuse: { value: null },
			backgroundTexture: { value: null }
		},
		fragmentShader
	};

	const shaderMaterial = new ShaderMaterial(options);

	new TextureLoader().load(imagePath, texture => {
		texture.minFilter = LinearFilter;
		shaderMaterial.uniforms.backgroundTexture.value = texture;
	});

	return { shaderMaterial };
};
