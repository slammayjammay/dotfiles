#define GLSLIFY 1
uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
varying vec2 vUv;

// http://mrdoob.github.io/webgl-blendfunctions/blendfunc.html

void main() {
	vec4 backgroundColor = texture2D(backgroundTexture, vUv);
	vec4 diffuseColor = texture2D(tDiffuse, vUv);

	vec4 src = diffuseColor;
	vec4 dest = backgroundColor;

	float srcFactor = 0.0;
	float destFactor = 1.0 - src.a;

	vec3 blended = src.rgb * src.a * srcFactor + dest.rgb * dest.a * destFactor;

	vec4 color = vec4(blended, 1.0);
	gl_FragColor = color;
}
