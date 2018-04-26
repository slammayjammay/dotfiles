module.exports = `
uniform sampler2D tDiffuse;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(tDiffuse, vUv);
}
`;
