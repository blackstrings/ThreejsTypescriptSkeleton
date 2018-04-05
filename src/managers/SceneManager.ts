import * as THREE from 'three';

import { Grid } from '../UI/Grid';
import { Shape2D } from '../components/shapes/Shape2D';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';
import { VectorUtils } from '../utils/VectorUtils';

export class SceneManager {

  private activeScene: THREE.Scene = null;
  private grid: Grid = null;
  public children: THREE.Object3D[];

  private shapes: Shape[] = [];

  private isCustomDrawEnabled: boolean = false;
  private newCustomShapePoints: THREE.Vector3[] = [];

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

    Subscriptions.mouseClick.subscribe((mouseClickPosition: THREE.Vector3) => {
      // custom draw if enabled
      this.drawCustomShape(mouseClickPosition);
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
      this.activeScene.add(shape.mesh);
    } else {
      console.warn('fail to add to sceen, shape or activeScene is null');
    }
  }

  /**
   * Handles removing the shape.mesh from the scene only, not the shape itself.
   * 
   * @param {Shape} shape 
   * @param {number} [id] 
   * @memberof SceneManager
   */
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

  public createShape(points?: THREE.Vector3[]): void {
    if (this.activeScene) {

      if (points) {

        const shape: Shape2D = new Shape2D(points);
        this.addShape(shape);

      } else {

        // for debugging only
        // test shape when no params are passd in and increment each new shape every 10 units apart
        const jsonPoints = [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 12, z: 0 },
          { x: 6, y: 18, z: 0 },
          { x: 12, y: 12, z: 0 },
          { x: 12, y: 0, z: 0 },
        ];

        const points: THREE.Vector3[] = VectorUtils.convertJsonArrayToVec3s(jsonPoints);
        const s: Shape2D = new Shape2D(points);
        s.mesh.position.x = this.children.length * 10;
        this.addShape(s);

      }

    } else {
      console.warn('activeScene is null');
    }
  }

  /**
   * Add shape to shapes array and to the scene.
   * 
   * @private
   * @param {Shape} shape 
   * @memberof SceneManager
   */
  private addShape(shape: Shape): void {
    if (this.shapes) {
      this.shapes.push(shape);
      this.addToScene(shape);
    } else {
      console.warn('failed to add shape, shape is null');
    }
  }

  /**
   * When custom draw is enabled, every 3 clicks will create a square
   * 
   * @private
   * @param {THREE.Vector3} mouseClickPosition 
   * @memberof SceneManager
   */
  private drawCustomShape(mouseClickPosition: THREE.Vector3): void {
    const maxClick: number = 4;
    if (this.isCustomDrawEnabled) {
      if (this.newCustomShapePoints && this.newCustomShapePoints.length < maxClick) {
        this.newCustomShapePoints.push(mouseClickPosition);
      
        if (this.newCustomShapePoints.length >= maxClick) {
          // draw the shape
          this.createShape(this.newCustomShapePoints);
          this.newCustomShapePoints = []; // reset
          this.setCustomDraw(false);  // turn off
        }
        
      }
    } // custom draw is not enabled, do nothing
  }

  public setCustomDraw(value: boolean): void {
    this.isCustomDrawEnabled = value;
  }

  public removeLastShape(): void {
    if (this.shapes && this.shapes.length && this.activeScene) {
      const shapeToRemove: Shape = this.shapes.pop();
      this.removeFromScene(shapeToRemove);
    } else {
      console.warn('failed to remove last shape, shapes or activeScene is null');
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