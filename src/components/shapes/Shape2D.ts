import * as THREE from 'three';

import { VectorUtils } from '../../utils/VectorUtils';

/**
 * Contains thet shape information such as position and shape vertices for 2d
 * 
 * @export
 * @class Shape
 */
export class Shape2D {

  /**
   * contains 2d points
   * 
   * @type {THREE.Vector3[]}
   * @memberof Shape2D
   */
  public points: THREE.Vector3[] = [];

  public mesh: THREE.Mesh = null;

  constructor(points: Array<ArrayLike<number>>) {
    try {
      this.points = VectorUtils.convertArrayToVec3s(points);
      this.create();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Creates the shape2d mesh and returns it.
   * 
   * @private
   * @memberof Shape
   */
  private create(): THREE.Mesh {
    if (this.points) {
      const vec2s: THREE.Vector2[] = VectorUtils.convertVec3sToVec2s(this.points);
      const shape: THREE.Shape = new THREE.Shape(vec2s);
      const shapeGeo: THREE.ShapeGeometry = new THREE.ShapeGeometry(shape);
      this.mesh = new THREE.Mesh(shapeGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      this.mesh.name = 'shape'; // has to be a valid name for the selection manager to filter the geometry during mouse down to make it selectable
    } else {
      throw new Error('<< Shape >> mesh2D is null');
    }
    return this.mesh;
  }


}