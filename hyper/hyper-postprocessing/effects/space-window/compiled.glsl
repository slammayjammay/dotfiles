#define GLSLIFY 1
uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float timeElapsed;
varying vec2 vUv;

vec4 backgroundImage(vec4 bg, vec4 fg) {
	vec3 blended = bg.rgb * bg.a + fg.rgb * fg.a * (1.0 - bg.a);
	return vec4(blended, 1.0);
}

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

// https://www.shadertoy.com/view/XlfGRj
// Star Nest by Pablo RomÃ¡n Andrioli

// This content is under the MIT License.

#define iterations 12
#define formuparam 0.53

#define volsteps 6
#define stepsize 0.25

#define zoom   0.800
#define tile   0.850
#define speed  0.008

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

vec4 spaceTravel() {
	//get coords and direction

	// vec2 uv=fragCoord.xy/resolution.xy-.5;
	vec2 uv = vUv - 0.5;

	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	float time=timeElapsed*speed+.25;

	//mouse rotation
	//float a1=.5+iMouse.x/resolution.x*2.;
	//float a2=.8+iMouse.y/resolution.y*2.;
	//float a1=0.05 * timeElapsed;
	float a2=0.05 * timeElapsed;
	//mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	//dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(time*2.,time,-2.);
	// from.xz*=rot1;
	// from.xy*=rot2;

	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
	vec3 p=from+s*dir*.5;
	p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
	float pa,a=pa=0.;
	for (int i=0; i<iterations; i++) {
	p=abs(p)/dot(p,p)-formuparam; // the magic formula
	a+=abs(length(p)-pa); // absolute sum of average change
	pa=length(p);
	}
	float dm=max(0.,darkmatter-a*a*.001); //dark matter
	a*=a*a; // add contrast
	if (r>6) fade*=1.-dm; // dark matter, don't render near
	//v+=vec3(dm,dm*.5,0.);
	v+=fade;
	v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
	fade*=distfading; // distance fading
	s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	return vec4(v*.01,1.);
}

void main() {
	vec4 spaceColor = spaceTravel();

	vec2 pos = curvedMonitor(vUv);

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

	color = backgroundImage(color, spaceColor);

	gl_FragColor = color;
}
