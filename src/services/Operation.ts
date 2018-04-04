import { Subscriptions } from '../events/Subscriptions';
import { SceneManager } from '../managers/SceneManager';


export class Operation {
  
  constructor(private sceneManager: SceneManager) {
    
  }
  
  public createShape(): void {
    this.sceneManager.createShape();
  }
}