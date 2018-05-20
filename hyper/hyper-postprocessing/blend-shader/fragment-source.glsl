uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform float timeElapsed;
varying vec2 vUv;

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

void main() {
	vec4 diffuseColor = texture2D(tDiffuse, vUv);

	// add motion to background
	// flip image horizontally
	// float sineThing = sin((vUv.x - timeElapsed * 0.1) * 3.0);
	vec2 pos = vec2(vUv.x + timeElapsed * 0.1, vUv.y);
	pos.x = mod(pos.x, 1.0);
	vec4 backgroundColor = texture2D(backgroundTexture, pos);

	// blend operation
	// http://mrdoob.github.io/webgl-blendfunctions/blendfunc.html
	vec4 src = diffuseColor;
	vec4 dest = backgroundColor;
	float srcFactor = 1.0 - dest.a;
	float destFactor = src.a;
	vec3 blended = src.rgb * srcFactor + dest.rgb * destFactor;

	// apply brightness?
	vec4 color = vec4(blended, 1.0) * 1.9;
	gl_FragColor = color;
}
