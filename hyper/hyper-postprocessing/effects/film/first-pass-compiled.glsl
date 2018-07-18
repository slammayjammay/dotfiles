#define GLSLIFY 1
uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform vec2 resolution;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

vec4 backgroundImage(vec4 bg, vec4 fg) {
	vec3 blended = bg.rgb * bg.a + fg.rgb * fg.a * (1.0 - bg.a);
	return vec4(blended, 1.0);
}

void main() {
	vec4 foregroundColor = texture2D(tDiffuse, vUv);
	vec4 backgroundColor = texture2D(backgroundTexture, vUv);

	vec4 color = backgroundImage(foregroundColor, backgroundColor);

	gl_FragColor = color;
}
