import { ReplaySubject } from 'rxjs/ReplaySubject';
export class Debug {

  public static debugSetupComplete: ReplaySubject<Debug> = new ReplaySubject<Debug>(1);

  /**
   * The prefix message for the console
   * 
   * @private
   * @type {string}
   * @memberof Debug
   */
  public message: string = 'Debug On: ';

  /**
   * All active cameras will have rotation enabeled
   * 
   * @type {boolean}
   * @memberof Debug
   */
  public forceEnableCameraRotation: boolean = false;

  /**
   * Mouse will log all movements
   * 
   * @type {boolean}
   * @memberof Debug
   */
  public mouseMoveLog: boolean = false;

  /**
   * Movement manager will log selected shape
   * 
   * @type {boolean}
   * @memberof Debug
   */
  public selectedShapeLog: boolean = true;

  constructor(public enabled: boolean = false, message?: string) {
    if (message) {
      this.message = message;
    }
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Debug.debugSetupComplete.next(this);
      resolve(true);
    });

  }


}