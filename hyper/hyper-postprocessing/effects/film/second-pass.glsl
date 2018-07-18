uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform vec2 resolution;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

#pragma glslify: filmShader = require('../../glsl/film', timeElapsed=timeElapsed, vUv=vUv)

void main() {
	gl_FragColor = filmShader(tDiffuse);
}
