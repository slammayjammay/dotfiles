uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

#pragma glslify: curvedMonitorShader = require('../../glsl/curved-monitor')
#pragma glslify: backgroundShader = require('../../glsl/background-image')

void main() {
	vec2 pos = curvedMonitorShader(vUv);

	// if the pixel is off the edge of the screen, set it transparent
	// avoids awkward texture sampling when pixel is not constrained to (0, 1)
	if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	vec4 color = texture2D(tDiffuse, pos);
	vec4 backgroundColor = texture2D(backgroundTexture, pos);
	backgroundColor.a = 0.4;

	color = backgroundShader(color, backgroundColor);

	gl_FragColor = color;
}
