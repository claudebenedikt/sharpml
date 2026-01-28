declare module "@mkkellogg/gaussian-splats-3d" {
  import * as THREE from "three";

  export interface ViewerOptions {
    cameraUp?: [number, number, number];
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    sharedMemoryForWorkers?: boolean;
    dynamicScene?: boolean;
    useBuiltInControls?: boolean;
    rootElement?: HTMLElement;
  }

  export interface AddSplatSceneOptions {
    splatAlphaRemovalThreshold?: number;
    showLoadingUI?: boolean;
    progressiveLoad?: boolean;
    onProgress?: (progress: number) => void;
  }

  export class Viewer {
    controls: THREE.OrbitControls | null;
    
    constructor(options?: ViewerOptions);
    addSplatScene(url: string, options?: AddSplatSceneOptions): Promise<void>;
    start(): void;
    dispose(): void;
  }
}
