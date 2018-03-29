import { SceneManager } from './SceneManager';
import { SlotManager } from './SlotManager';
import { RenderManager } from './RenderManager';
import { CameraManager } from './CameraManager';
import { CanvasManager } from './CanvasManager';
import { SelectionManager } from './SelectionManager';
import { Debug } from '../utils/Debug';
import { Mouse } from '../UI/Mouse';
import { UIManager } from './UIManager';

/**
 * Inits all the managers and oversees all managers.
 * 
 * @export
 * @class MainManager
 */
export class MainManager {

  private canvasManager: CanvasManager;
  private sceneManager: SceneManager;
  private slotManager: SlotManager;
  private renderManager: RenderManager;
  private cameraManager: CameraManager;
  private uiManager: UIManager;

  private selectionManager: SelectionManager;
  private mouse: Mouse;

  constructor(dom: HTMLElement, uiDom:HTMLElement) {

    try {

      // pre init
      this.sceneManager = new SceneManager();
      this.uiManager = new UIManager(uiDom);
      this.canvasManager = new CanvasManager(dom);
      this.cameraManager = new CameraManager(this.canvasManager);
      
      // shold occur last as it kicks start the renderer too
      this.renderManager = new RenderManager(this.canvasManager.rendererDomParent, this.sceneManager.getActiveScene(), this.cameraManager.getActiveCamera());
      
      this.mouse = new Mouse(this.canvasManager, this.cameraManager);
      this.selectionManager = new SelectionManager(this.canvasManager, this.cameraManager, this.sceneManager, this.mouse);
      
      this.slotManager = new SlotManager();
      
      // after init
      const debug: Debug = new Debug(true);

      debug.init().then((value: boolean) => {
        // init after 
        
        // create orbital controls
        this.cameraManager.init();
      });
      

    } catch (e) {
      throw e;
    }
  }

  public init(): void {
    if (this.renderManager && this.sceneManager && this.slotManager) {

    }
  }

}