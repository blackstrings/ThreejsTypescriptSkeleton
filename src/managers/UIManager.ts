import { Panel } from '../UI/Panel';
import { Button } from '../UI/Button';

/**
 * Handles the button GUI for interacting with the canvas.
 * 
 * @export
 * @class UIManager
 */
export class UIManager {
  
  private panels: Panel[] = [];
  private dom: HTMLElement = null;
  
  constructor(uiDom: HTMLElement) {
    if (uiDom) {
      this.dom = document.createElement('div');
      this.dom.className = 'uiMain';
      uiDom.appendChild(this.dom);
      this.init();
      console.log('<< UIManager >> init completed');
    } else {
      throw new Error('UIManager failed to create, rootDom is null');
    }
    
  }
  
  private init(): void {
    // panel
    const panel: Panel = new Panel('topPanel');
    this.addPanel(panel);
    
    // button
    const newBtn: Button = new Button('btn', 'New Shape');
    newBtn.dom.addEventListener('click', function(){
      console.log("click");
    });
    panel.add(newBtn);
    
  }
  
  public addPanel(panel: Panel): void {
    if (this.panels) {
      this.panels.push(panel);
      this.dom.appendChild(panel.dom);
    } else {
      console.error('failed to add panel, panels is null');
    }
  }
  
  public removePanel(panel: Panel): void {
    if (this.panels) {
      const index: number = this.panels.indexOf(panel);
      if (index >= 0) {
        const panelToRemove: Panel = this.panels.splice(index, 1)[0];
        this.dom.removeChild(panelToRemove.dom);
        console.log('panel removed successfully');
      }
    } else {
      console.error('failed to remove panel, panel is null');
    }
  }

}