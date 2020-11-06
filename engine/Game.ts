import Camera from './Camera.js'
import GameObject from './GameObject.js'
import GameObjectCollection from './GameObjectCollection.js'
import Renderer from './Renderer.js'
import Updater from './Updater.js'

export default class Game {
  #pressedKeys: {[key: string]: undefined | boolean} = {}
  #lastFrameTimestamp: number = performance.now()
  #frameRequestId: number = -1
  readonly #pendingReleasedKeys: string[] = []
  readonly #gameObjects: GameObjectCollection = new GameObjectCollection()

  constructor(
    private readonly renderer: Renderer,
    private readonly updater: Updater,
  ) {
  }

  public get camera(): Camera {
    return this.renderer.camera
  }

  public get gameObjects(): readonly GameObject[] {
    return this.#gameObjects.gameObjects
  }

  public get pressedKeys(): {readonly [key: string]: undefined | boolean} {
    return this.#pressedKeys
  }

  public run(): void {
    if (this.#frameRequestId > -1) {
      throw new Error('The run method cannot be called twice without calling stop() first')
    }

    document.addEventListener('keydown', this.#onKeyDown)
    document.addEventListener('keyup', this.#onKeyUp)
    this.#lastFrameTimestamp = performance.now()
    this.#frameRequestId = requestAnimationFrame(this.#update)

    this.updater.onRun(this)
    this.renderer.render(this, 0)
  }

  public stop(): void {
    if (this.#frameRequestId === -1) {
      throw new Error('The engine loop is not running, run the run() method first')
    }

    this.updater.onStop(this)
    cancelAnimationFrame(this.#frameRequestId)
    this.#frameRequestId = -1
  }

  public addGameObject(gameObject: GameObject): void {
    this.#gameObjects.addGameObject(gameObject)
  }

  #update = (): void => {
    const now = performance.now()
    // Using requestAnimationFrame has to be able to handle large deltas caused when it 'hibernates' in a background
    // or non-visible tab.
    const deltaTime = Math.min(1, (now - this.#lastFrameTimestamp) / 1000)
    this.updater.update(this, deltaTime)
    this.renderer.render(this, deltaTime)
    for (const releasedKey of this.#pendingReleasedKeys) {
      this.#pressedKeys[releasedKey] = false
    }
    this.#pendingReleasedKeys.splice(0)
    this.#lastFrameTimestamp = now
    this.#frameRequestId = requestAnimationFrame(this.#update)
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    this.#pressedKeys[event.key] = true
  }

  #onKeyUp = (event: KeyboardEvent): void => {
    this.#pendingReleasedKeys.push(event.key)
  }
}
