const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter, Vector4 } = require('three');
const fetchNasaImage = require('./fetch-nasa-image');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShader = readFileSync('/Users/Scott/dotfiles/hyper/hyper-postprocessing/glsl/nasa-curved/fragment-compiled.glsl').toString();

	const materialOptions = {
		uniforms: {
			backgroundTexture: { value: null }
		},
		fragmentShader
	};

	const shaderMaterial = new ShaderMaterial(materialOptions);

	fetchNasaImage().then((url, error) => {
		if (error) {
			console.warn(error);
		}

		new TextureLoader().load(url, texture => {
			texture.minFilter = LinearFilter;
			shaderMaterial.uniforms.backgroundTexture.value = texture;
		});
	});

	return { shaderMaterial };
};
