#define GLSLIFY 1
uniform sampler2D tDiffuse;
uniform sampler2D backgroundTexture;
uniform float aspect;
uniform float timeElapsed;
uniform float timeDelta;
varying vec2 vUv;

// pythagorean theorem
float distanceFromOrigin(vec2 point, vec2 origin) {
	float deltaX = (point.x - origin.x);
	float deltaY = (point.y - origin.y);
	return sqrt(pow(deltaX, 2.0) + pow(deltaY, 2.0));
}

float easeInQuart(float time, float begin, float change, float duration) {
	return change * (time /= duration) * time * time * time + begin;
}

vec2 curvedMonitor(vec2 inputUV) {
	vec2 screenCenter = vec2(0.5, 0.5);
	float radius = 0.5;
	float magnitude = 0.15; // how far the center of the "monitor" points out
	float cutShort = 0.3; // how far along the the easing curve we travel...I think...

	vec2 coords = vec2(inputUV.x - screenCenter.x, inputUV.y - screenCenter.y);

	float distFromOrigin = distanceFromOrigin(inputUV, screenCenter);

	float scalar = easeInQuart(distFromOrigin, 1.0 / cutShort - magnitude, magnitude, radius);
	coords *= scalar * cutShort;

	return vec2(coords.x + screenCenter.x, coords.y + screenCenter.y);
}

vec4 backgroundImage(vec4 bg, vec4 fg) {
	vec3 blended = bg.rgb * bg.a + fg.rgb * fg.a * (1.0 - bg.a);
	return vec4(blended, 1.0);
}

void main() {
	vec2 pos = curvedMonitor(vUv);

	// if the pixel is off the edge of the screen, set it transparent
	// avoids awkward texture sampling when pixel is not constrained to (0, 1)
	if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	vec4 color = texture2D(tDiffuse, pos);
	vec4 backgroundColor = texture2D(backgroundTexture, pos);
	backgroundColor.a = 0.4;

	color = backgroundImage(color, backgroundColor);

	gl_FragColor = color;
}
