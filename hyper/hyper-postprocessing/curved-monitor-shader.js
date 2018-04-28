module.exports = `
uniform sampler2D tDiffuse;
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

void main() {
	vec2 screenCenter = vec2(0.5, 0.5);
	float radius = 0.5;
	float magnitude = 0.15; // how far the center of the "monitor" points out
	float cutShort = 0.3; // how far along the the easing curve we travel...I think...

	vec2 coords = vec2(vUv.x - screenCenter.x, vUv.y - screenCenter.y);

	float distFromOrigin = distanceFromOrigin(vUv, screenCenter);

	float scalar = easeInQuart(distFromOrigin, 1.0 / cutShort - magnitude, magnitude, radius);
	coords *= scalar * cutShort;

	vec2 newPos = vec2(coords.x + screenCenter.x, coords.y + screenCenter.y);

	// if the pixel is off the edge of the screen, set it transparent
	// avoids awkward texture sampling when pixel is not constrained to (0, 1)
	if (newPos.x < 0.0 || newPos.y < 0.0 || newPos.x > 1.0 || newPos.y > 1.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}
	vec4 color = texture2D(tDiffuse, newPos);
	gl_FragColor = color;
}
`;
