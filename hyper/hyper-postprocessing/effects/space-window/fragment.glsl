uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float timeElapsed;
varying vec2 vUv;

#pragma glslify: curvedMonitorShader = require('../../glsl/curved-monitor')
#pragma glslify: backgroundShader = require('../../glsl/background-image')
#pragma glslify: spaceTravelShader = require('../../glsl/space-travel', resolution=resolution, timeElapsed=timeElapsed)

void main() {
	vec2 pos = curvedMonitorShader(vUv);

	pos -= 0.5;
	pos *= 1.1;
	pos += 0.5;

	vec4 spaceColor = spaceTravelShader(pos);

	// if the pixel is off the edge of the screen, set it transparent
	// avoids awkward texture sampling when pixel is not constrained to (0, 1)
	if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	vec4 color = texture2D(tDiffuse, pos);
	// vec4 backgroundColor = texture2D(backgroundTexture, pos);
	// spaceColor.a = 0.4;

	color = backgroundShader(color, spaceColor);

	gl_FragColor = color;
}
