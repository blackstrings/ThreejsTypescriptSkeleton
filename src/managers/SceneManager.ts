import * as THREE from 'three';

import { Grid } from '../UI/Grid';
import { Shape2D } from '../components/shapes/Shape2D';
import { Subscriptions } from '../events/Subscriptions';

export class SceneManager {

  private activeScene: THREE.Scene = null;
  private grid: Grid = null;
  public children: THREE.Object3D[];

  constructor() {
    this.activeScene = new THREE.Scene();
    this.children = this.activeScene.children;
    this.showGrid();
    this.showAxisHelper();
    this.testScene();
    
    // TODO: remove this working subscription test with rxjs
    Subscriptions.selectedObjectId.subscribe((id: number) => {
      console.error('id is: ' + id);
    });
  }

  public showGrid(): void {
    if (this.activeScene) {
      if (!this.grid) {
        this.grid = new Grid('front', 64);
        this.activeScene.add(this.grid.mesh);
      }
      this.grid.mesh.visible = true;
    } else {
      console.warn('Grid failed to show, activeScene is null');
    }
  }

  public hideGrid(): void {
    if (this.activeScene && this.grid) {
      this.activeScene.remove(this.grid.mesh);
    }
  }

  public showAxisHelper(): void {
    const axis = new THREE.AxesHelper();
    this.activeScene.add(axis);
  }

  private testScene(): void {
    const mat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: .6 });
    
    // sphere
    const sGeo: THREE.SphereGeometry = new THREE.SphereGeometry(5);
    const sphereMesh: THREE.Mesh = new THREE.Mesh(sGeo, mat);
    sphereMesh.name = 'sphere';
    this.activeScene.add(sphereMesh);
    
    // cube
    const cubeGeo: THREE.CubeGeometry = new THREE.CubeGeometry(12, 2, 12);
    const cubeMesh: THREE.Mesh = new THREE.Mesh(cubeGeo, mat);
    this.activeScene.add(cubeMesh);
    cubeMesh.name = 'cube';

    // custom mesh
    const points: number[][] = [
      [0, 0], [0, 12], [6, 18], [12, 12], [12, 0]
    ];
    const s: Shape2D = new Shape2D(points);
    this.activeScene.add(s.mesh);
  }

  public getActiveScene(): THREE.Scene {
    return this.activeScene;
  }

}