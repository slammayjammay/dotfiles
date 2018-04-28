const { Vector2, TextureLoader, LinearFilter } = require('three');

const path = 'file:///Users/Scott/dotfiles/hyper/hyper-postprocessing/images/underwater.jpg';

// https://www.shadertoy.com/view/4slGRM
const fragmentShader = `
uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform vec2 resolution;
uniform float timeElapsed;
varying vec2 vUv;

const float PI = 3.1415926535897932;

// play with these parameters to custimize the effect
// ===================================================

//speed
const float speed = 0.1;
const float speed_x = 0.1;
const float speed_y = 0.3;

// refraction
const float emboss = 0.30;
const float intensity = 1.5;
const int steps = 8;
const float frequency = 6.0;
const int angle = 7; // better when a prime

// reflection
const float delta = 60.;
const float intence = 700.;

const float reflectionCutOff = 0.012;
const float reflectionIntence = 200000.;

// ===================================================
float col(vec2 coord,float time) {
	float delta_theta = 2.0 * PI / float(angle);
	float col = 0.0;
	float theta = 0.0;
	for (int i = 0; i < steps; i++)
	{
		vec2 adjc = coord;
		theta = delta_theta*float(i);
		adjc.x += cos(theta)*time*speed + time * speed_x;
		adjc.y -= sin(theta)*time*speed - time * speed_y;
		col = col + cos( (adjc.x*cos(theta) - adjc.y*sin(theta))*frequency)*intensity;
	}

	return cos(col);
}

//---------- main

void main() {
	float time = timeElapsed*1.3;

	vec2 p = vUv.xy, c1 = p, c2 = p;
	float cc1 = col(c1,time);

	c2.x += resolution.x/delta;
	float dx = emboss*(cc1-col(c2,time))/delta;

	c2.x = p.x;
	c2.y += resolution.y/delta;
	float dy = emboss*(cc1-col(c2,time))/delta;

	c1.x += dx*2.;
	c1.y = (c1.y+dy*2.);

	float alpha = 1.+dot(dx,dy)*intence;

	float ddx = dx - reflectionCutOff;
	float ddy = dy - reflectionCutOff;
	if (ddx > 0. && ddy > 0.)
		alpha = pow(alpha, ddx*ddy*reflectionIntence);

	////////// not part of the original shader
	c1.x -= 0.1;
	c1.y -= 0.1;
	c1 *= 0.9;
	c1.x += 0.1;
	c1.y += 0.1;
	vec4 col = texture2D(backgroundTexture,c1)*(alpha); // ...except this
	vec4 color1 = texture2D(tDiffuse, vUv);
	col.a = 0.4;
	vec3 blended = color1.rgb * color1.a + col.rgb * col.a * (1.0 - color1.a);
	////////// not part of the original shader
	gl_FragColor = vec4(blended, 1.0);
}
`;


module.exports = ({ ShaderMaterial }) => {
	const loader = new TextureLoader();

	const options = {
		uniforms: {
			backgroundTexture: { value: null }
		},
		fragmentShader
	};

	const shaderMaterial = new ShaderMaterial(options);

	loader.load(path, texture => {
		texture.minFilter = LinearFilter;
		shaderMaterial.uniforms.backgroundTexture.value = texture;
	});

	return { shaderMaterial };
};
