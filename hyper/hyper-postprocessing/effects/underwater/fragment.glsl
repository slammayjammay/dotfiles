uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform vec2 resolution;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

#pragma glslify: backgroundShader = require('../../glsl/background-image')
#pragma glslify: rippleShader = require('../../glsl/ripple', resolution=resolution, timeElapsed=timeElapsed)

void main() {
	vec2 ripplePos = rippleShader(vUv);
	ripplePos *= 0.9;

	vec4 foregroundColor = texture2D(tDiffuse, vUv);
	vec4 backgroundColor = texture2D(backgroundTexture, ripplePos);

	backgroundColor.a = 0.4;

	vec4 color = backgroundShader(foregroundColor, backgroundColor);

	gl_FragColor = color;
}
