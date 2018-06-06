uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float timeElapsed;
varying vec2 vUv;

#pragma glslify: backgroundShader = require('../../glsl/background-image')
#pragma glslify: curvedMonitorShader = require('../../glsl/curved-monitor')
#pragma glslify: spaceTravelShader = require('../../glsl/space-travel', vUv=vUv, resolution=resolution, timeElapsed=timeElapsed)

void main() {
	vec4 spaceColor = spaceTravelShader();

	vec2 pos = curvedMonitorShader(vUv);

	vec4 color = texture2D(tDiffuse, pos);

	if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
		color = vec4(0.0);
	}

	// pos -= 0.5;
	// pos *= 1.1;
	// bool outOfBounds = (abs(pos.x) >= 0.5 || abs(pos.y) >= 0.5);
	// pos += 0.5;

	// vec4 color;

	// if (outOfBounds) {
	// 	color = vec4(0.0);
	// } else {
	// 	color = texture2D(tDiffuse, pos);
	// }

	color = backgroundShader(color, spaceColor);

	gl_FragColor = color;
}
