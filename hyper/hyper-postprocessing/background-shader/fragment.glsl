vec4 backgroundShader(vec4 bg, vec4 fg) {
	vec3 blended = bg.rgb * bg.a + fg.rgb * fg.a * (1.0 - bg.a);
	return vec4(blended, 1.0);
}

#pragma glslify: export(backgroundShader)
