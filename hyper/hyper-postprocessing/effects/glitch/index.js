const { homedir } = require('os');
const { readFileSync } = require('fs');
const { Vector2, TextureLoader, LinearFilter, Uniform } = require('three');
const {
	EffectPass,
	Effect,
	GlitchEffect,
	BloomEffect,
	ScanlineEffect,
	SepiaEffect,
	VignetteEffect
} = require('postprocessing');
const fetchNasaImage = require('../nasa-curved-monitor/fetch-nasa-image');

const nasaFragment = `
	uniform sampler2D backgroundImage;

	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		outputColor = texture2D(backgroundImage, uv) * 0.8;
	}
`;

module.exports = ({ ShaderMaterial }) => {
	const effects = [];

	const nasaEffect = new Effect('NasaEffect', nasaFragment, {
		uniforms: new Map([['backgroundImage', new Uniform(null)]])
	});

	fetchNasaImage().then((url, error) => {
		if (error) {
			console.warn(error);
		}

		new TextureLoader().load(url, texture => {
			texture.minFilter = LinearFilter;
			nasaEffect.uniforms.get('backgroundImage').value = texture;
		});
	});

	// effects.push(nasaEffect);

	effects.push(new GlitchEffect({
		delay: new Vector2(1, 7),
		duration: new Vector2(0, 1),
		columns: 0.05
	}));

	effects.push(new BloomEffect());

	effects.push(new ScanlineEffect({ density: 1 }));
	effects.push(new SepiaEffect({ intensity: 0.5 }));
	effects.push(new VignetteEffect({
		darkness: 0.5,
		offset: 0.2
	}));

	const fragmentShaderPath = `${homedir()}/dotfiles/hyper/hyper-postprocessing/effects/glitch/effectFragment.glsl`;
	const fragmentShader = readFileSync(fragmentShaderPath).toString();
	effects.push(new Effect('curvedMonitor', fragmentShader, {
		// https://github.com/vanruesc/postprocessing/blob/master/src/effects/blending/BlendFunction.js
		blendFunction: 12 // normal blend -- overwrites
	}));

	return { shaderPass: new EffectPass(null, ...effects) };
};
