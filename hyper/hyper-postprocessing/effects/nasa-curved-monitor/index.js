const { readFileSync } = require('fs');
const { homedir } = require('os');
const { TextureLoader, LinearFilter, Vector4 } = require('three');
const fetchNasaImage = require('./fetch-nasa-image');

module.exports = ({ ShaderMaterial }) => {
	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/nasa-curved-monitor/compiled.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();

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
