import {IRenderer} from './Renderer.js'
import {IUpdater} from './Updater.js'

export default class Game {
  public readonly pressedKeys: {readonly [key: string]: undefined | boolean} = {}
  private lastFrameTimestamp: number = performance.now()
  private frameRequestId: number = -1
  private readonly pendingReleasedKeys: string[] = []

  constructor(
    private readonly renderer: IRenderer<any>,
    private readonly updater: IUpdater,
  ) {
  }

  public run(): void {
    if (this.frameRequestId > -1) {
      throw new Error('The run method cannot be called twice without calling stop() first')
    }

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    this.lastFrameTimestamp = performance.now()
    this.frameRequestId = requestAnimationFrame(this.update)

    this.updater.onRun()
    this.renderer.render(0)
  }

  public stop(): void {
    if (this.frameRequestId === -1) {
      throw new Error('The engine loop is not running, run the run() method first')
    }

    this.updater.onStop()
    cancelAnimationFrame(this.frameRequestId)
    this.frameRequestId = -1
  }

  private update = (): void => {
    const now = performance.now()
    // Using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background
    // or non-visible tab.
    const deltaTime  = Math.min(1, (now - this.lastFrameTimestamp) / 1000)
    this.updater.update(this, deltaTime)
    this.renderer.render(deltaTime)
    for (const releasedKey of this.pendingReleasedKeys) {
      (this.pressedKeys as {[key: string]: boolean})[releasedKey] = false
    }
    this.pendingReleasedKeys.splice(0)
    this.lastFrameTimestamp = now
    this.frameRequestId = requestAnimationFrame(this.update)
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    (this.pressedKeys as any)[event.key] = true
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    this.pendingReleasedKeys.push(event.key)
  }
}
