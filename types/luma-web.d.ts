declare module '@lumaai/luma-web' {
  import * as THREE from 'three';

  interface LumaSplatsThreeOptions {
    source: string;
    loadingAnimationEnabled?: boolean;
  }

  export class LumaSplatsThree extends THREE.Object3D {
    constructor(options: LumaSplatsThreeOptions);
  }
}
