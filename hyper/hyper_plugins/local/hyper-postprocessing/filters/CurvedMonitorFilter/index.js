import { Pass } from 'postprocessing';
import { CurvedMonitorFilterMaterial } from './material';

class CurvedMonitorFilter extends Pass {
	constructor(options = {}) {
		super();

		this.options = options;
		this.needsSwap = true;
		this.material = new CurvedMonitorFilterMaterial();
		this.quad.material = this.material;
	}

	render(renderer, readBuffer, writeBuffer) {
		this.material.uniforms.tDiffuse.value = readBuffer.texture;

		renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
	}
}

export { CurvedMonitorFilter };
