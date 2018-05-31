uniform sampler2D tDiffuse;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

#pragma glslify: curvedMonitorShader = require('../../glsl/curved-monitor')

void main() {
	vec2 pos = curvedMonitorShader(vUv);

	// if the pixel is off the edge of the screen, set it transparent
	// avoids awkward texture sampling when pixel is not constrained to (0, 1)
	if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	vec4 color = texture2D(tDiffuse, pos);

	gl_FragColor = color;
}
