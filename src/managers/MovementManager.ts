import * as THREE from 'three';

import { Shape } from '../components/shapes/Shape';
import { CanvasManager } from '../managers/CanvasManager';
import { Subscriptions } from "../events/Subscriptions";
import { Mouse } from '../UI/Mouse';
import { CameraManager } from './CameraManager';
import { SceneManager } from './SceneManager';
import { Debug } from '../utils/Debug';

export class MovementManager {
  
  private debug: Debug = null;

  public selectedShape: Shape;

  /**
   * prevent unnecessary multiple event listeners from firing when already fired
   * 
   * @private
   * @type {boolean}
   * @memberof MovementManager
   */
  private isActivated: boolean = false;

  public isEnabled: boolean = true;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  /**
   * A math plane for finding intersection points on mouse down and mouse move.
   * THREE.Plane is a non-visible math plane that has a direction and stretches out infinitely in space.
   * The default plane normal is +Z which is what you want for mouse detection on screen
   * @private
   * @type {THREE.Plane}
   * @memberof MovementManager
   */
  private plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  constructor(private canvasManager: CanvasManager, private cameraManager: CameraManager, private sceneManager: SceneManager, private mouse: Mouse) {
    
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
    
    Subscriptions.selectedObjectId.subscribe((objectId: number) => {
      if (this.sceneManager) {
        const shape: Shape = this.sceneManager.getShape(objectId);
        if (shape) {
          this.selectedShape = shape;
          if (this.debug && this.debug.enabled && this.debug.selectedShapeLog) {
            console.log('Selected shape is:');
            console.log(this.selectedShape);
          }
        }
        // do nothing
      } else {
        console.warn('failed to set selected shape, sceneManager is null');
      }
    });
    
    this.activate();
  }

  public activate(): void {
    if (this.isActivated) {
      return;
    }

    this.isActivated = true;
    if (this.canvasManager.rendererDomParent) {
      this.canvasManager.rendererDomParent.addEventListener('mousemove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('mouseup', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('mouseleave', this.finalize.bind(this), false);  // when mouse move outside of canvas

      this.canvasManager.rendererDomParent.addEventListener('touchmove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('touchend', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('touchcancel', this.finalize.bind(this), false);
    }
  }

  public deactivate(): void {
    if (!this.isActivated) {
      return;
    }

    this.isActivated = false;
    if (this.canvasManager.rendererDomParent) {
      this.canvasManager.rendererDomParent.removeEventListener('mousemove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('mouseup', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('mouseleave', this.finalize.bind(this), false);  // when mouse move outside of canvas

      this.canvasManager.rendererDomParent.removeEventListener('touchmove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('touchend', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('touchcancel', this.finalize.bind(this), false);
    }
  }

  protected move(event: MouseEvent): void {
    if (this.isEnabled && this.selectedShape) {
      console.log(`<< MovementManager >> 'mousemove'`);
      event.preventDefault();

      this.mouse.update(event);

      this.raycaster.setFromCamera(this.mouse.position, this.cameraManager.getActiveCamera());

      // location of the moust down in 3D space on the math plane
      const intersection: THREE.Vector3 = new THREE.Vector3();

      // tell the ray caster to use the plane for finding intersection points
      const mouseDownPosition: THREE.Vector3 = this.mouse.mouseDownPosition;
      if (this.raycaster.ray.intersectPlane(this.plane, intersection) && mouseDownPosition) {

        // const offset: THREE.Vector3 = new THREE.Vector3();
        // offset.subVectors(intersection.clone(),mouseDownPosition.clone());
        

        const diff: THREE.Vector3 = new THREE.Vector3();
        diff.subVectors(intersection.clone(), mouseDownPosition.clone());

        // move to new location
        var w1: THREE.Vector3 = this.selectedShape.mesh.parent.localToWorld(mouseDownPosition.clone());
        var w2: THREE.Vector3 = w1.add(diff);
        const newWorldToLocal: THREE.Vector3 = this.selectedShape.mesh.parent.worldToLocal(w2);
        
        const newWorldPos: THREE.Vector3 = this.selectedShape.mesh.position.clone().add(diff);
        const newLocalPos: THREE.Vector3 = this.selectedShape.mesh.parent.worldToLocal(newWorldPos.clone());

        // seem really close, just need to offset from the intersection
        // we only move in the direction of y when it comes to local movement so only update the y coordinate
        this.selectedShape.mesh.position.set(
          intersection.x,
          intersection.y,
          intersection.z
        );
        
        
        
        // snapping
        //Math.round(newLocalPos.y / this._snapValue) * this._snapValue,

        //dragProxy.updateDragProxy(diff, selectedDragProxy);


      }
    }
  }

  private finalize(e: MouseEvent): void {
    this.selectedShape = null;
  }

}