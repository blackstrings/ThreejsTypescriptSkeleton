import * as THREE from 'three';

import { Grid } from '../UI/Grid';
import { Shape2D } from '../components/shapes/Shape2D';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';

export class SceneManager {

  private activeScene: THREE.Scene = null;
  private grid: Grid = null;
  public children: THREE.Object3D[];
  
  private shapes: Shape[] = [];

  constructor() {
    this.activeScene = new THREE.Scene();
    console.error(`active scene ready of id: ${this.activeScene.id}`);
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


  //TODO allow add any type of shape
  public addToScene(shape: Shape): void {
    if (shape && this.activeScene) {
      this.shapes.push(shape);
      this.activeScene.add(shape.mesh);
    } else {
      console.warn('fail to add to sceen, shape or activeScene is null');
    }
  }

  public removeFromScene(shape: Shape, id?: number): void {
    const prefix: string = 'failed to remove from scene,';
    let shapeToRemove: THREE.Object3D = null;
    if (this.activeScene) {

      if (shape) {  // by shape

        shapeToRemove = shape.mesh;

      } else if (id => 0) { // by id
        const objs: THREE.Object3D[] = this.children.filter(obj => obj.id === id);
        if (objs && objs.length) {
          shapeToRemove = objs[0];
        } else {
          console.warn(`${prefix} no obj found for id: ${id}`);
        }
      } else {
        console.warn(`${prefix} shape is null`);
      }

      if (shapeToRemove) {
        this.activeScene.remove(shapeToRemove);
      }
    } else {
      console.warn(`${prefix} activeScene is null`);
    }
  }

  public createShape(): void {
    if (this.activeScene) {

      // test
      const points: number[][] = [
        [0, 0], [0, 12], [6, 18], [12, 12], [12, 0]
      ];
      const s: Shape2D = new Shape2D(points);
      s.mesh.position.x = this.children.length * 10;
      this.addToScene(s);

    } else {
      console.warn('activeScene is null');
    }
  }
  
  public removeLastShape(): void {
    if (this.shapes && this.activeScene) {
      const shapeToRemove: Shape = this.shapes[this.shapes.length-1];
      this.removeFromScene(shapeToRemove);
    }
  }

  private testScene(): void {
    const mat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: .6 });

    // sphere
    // const sGeo: THREE.SphereGeometry = new THREE.SphereGeometry(5);
    // const sphereMesh: THREE.Mesh = new THREE.Mesh(sGeo, mat);
    // sphereMesh.name = 'sphere';
    // this.activeScene.add(sphereMesh);

    // // cube
    // const cubeGeo: THREE.CubeGeometry = new THREE.CubeGeometry(12, 2, 12);
    // const cubeMesh: THREE.Mesh = new THREE.Mesh(cubeGeo, mat);
    // this.activeScene.add(cubeMesh);
    // cubeMesh.name = 'cube';

  }

  public getActiveScene(): THREE.Scene {
    return this.activeScene;
  }

}