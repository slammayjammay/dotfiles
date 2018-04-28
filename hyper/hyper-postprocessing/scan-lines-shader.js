const fragmentShader = `
uniform sampler2D tDiffuse;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

void main() {
	vec4 green = vec4(9.0 / 255.0, 54.0 / 255.0, 21.0 / 255.0, 1.0);
	float numScanLines = 120.0;
	float interval = 1.0 / numScanLines;

	vec4 color = texture2D(tDiffuse, vUv);

	float flooredY = floor(vUv.y * numScanLines) / numScanLines;

	gl_FragColor = vec4(flooredY, 0.0, 0.0, 1.0);
	return;

	if (mod(flooredY / interval, 2.0) == 0.0) {
		// color *= 0.6;
		color = green;
	}

	gl_FragColor = color;
}
`;

module.exports = (ShaderPass, ShaderMaterial) => {
	const shaderMaterial = new ShaderMaterial({ fragmentShader });
	return { shaderMaterial };
};

