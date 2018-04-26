import { ShaderMaterial } from 'three';

const vertexShader = `
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D tDiffuse;
varying vec2 vUv;

// pythagorean theorem
float distanceFromOrigin(vec2 point, vec2 origin) {
	float deltaX = (point.x - origin.x);
	float deltaY = (point.y - origin.y);
	return sqrt(pow(deltaX, 2.0) + pow(deltaY, 2.0));
}

// http://gizma.com/easing/
// HOW THE FUCK DOES THIS WORK
float easeInOutQuad(float time, float begin, float change, float duration) {
 if ((time /= duration / 2.0) < 1.0) {
   return change / 2.0 * time * time + begin;
 }
 return -change / 2.0 * ((--time) * (time - 2.0) - 1.0) + begin;
}

float easeInQuad(float time, float begin, float change, float duration) {
	return change * (time /= duration) * time + begin;
}

float PI = 3.14159265358979323846264338327950288;

float easeInSine(float time, float begin, float change, float duration) {
	return -change * cos(time / duration * (PI / 2.0)) + change + begin;
}

float easeInExpo(float time, float begin, float change, float duration) {
	return (time == 0.0) ? begin : change * pow(2.0, 10.0 * (time / duration - 1.0)) + begin;
}

float easeInQuart(float time, float begin, float change, float duration) {
	return change * (time /= duration) * time * time * time + begin;
}

float linear(float time, float begin, float change, float duration) {
	return change * time / duration + begin;
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

class CurvedMonitorFilterMaterial extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				tDiffuse: { value: null }
			},
			vertexShader,
			fragmentShader
		});
	}
}

export { CurvedMonitorFilterMaterial };
