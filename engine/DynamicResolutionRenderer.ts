import Camera from './Camera.js'
import Canvas2DRenderer from './Canvas2DRenderer.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import Renderer, {Mesh, Polygon, Sprite} from './Renderer.js'
import Vector3 from './Vector3.js'

export default class DynamicResolutionRenderer implements Renderer {
  readonly #renderer: Canvas2DRenderer
  readonly #scaleSteps: readonly number[]
  readonly #targetFrameMs: number
  readonly #scaleDownThreshold: number
  readonly #scaleUpThreshold: number
  readonly #scaleUpHoldFrames: number
  readonly #emaAlpha: number
  #ema: number = -1
  #currentScaleIndex: number = 0
  #holdFrames: number = 0
  #warmupTime: number = 250

  constructor(
    renderer: Canvas2DRenderer,
    scaleSteps: readonly number[],
    targetFrameMs: number,
    scaleDownThreshold: number,
    scaleUpThreshold: number,
    scaleUpHoldFrames: number,
    emaAlpha: number,
  ) {
    this.#renderer = renderer
    this.#scaleSteps = scaleSteps
    this.#targetFrameMs = targetFrameMs
    this.#scaleDownThreshold = scaleDownThreshold
    this.#scaleUpThreshold = scaleUpThreshold
    this.#scaleUpHoldFrames = scaleUpHoldFrames
    this.#emaAlpha = emaAlpha
  }

  public get camera(): Camera {
    return this.#renderer.camera
  }

  public render(game: Game, deltaTime: number): void {
    this.#renderer.render(game, deltaTime)

    if (this.#warmupTime) {
      // During the initial warmup period, we skip dynamic resolution adjustments to allow the game to stabilize.
      this.#warmupTime -= Math.min(this.#warmupTime, deltaTime)
      return
    }

    this.#ema = this.#ema < 0 ? deltaTime : this.#ema + (deltaTime - this.#ema) * this.#emaAlpha

    const scaleDownBudget = this.#targetFrameMs * this.#scaleDownThreshold
    const scaleUpBudget = this.#targetFrameMs * this.#scaleUpThreshold

    if (this.#ema > scaleDownBudget && this.#currentScaleIndex < this.#scaleSteps.length - 1) {
      this.#currentScaleIndex++
      this.#holdFrames = 0
      this.#renderer.resolutionScale = this.#scaleSteps[this.#currentScaleIndex]
    } else if (this.#ema < scaleUpBudget && this.#currentScaleIndex > 0) {
      this.#holdFrames++
      if (this.#holdFrames >= this.#scaleUpHoldFrames) {
        this.#currentScaleIndex--
        this.#holdFrames = 0
        this.#renderer.resolutionScale = this.#scaleSteps[this.#currentScaleIndex]
      }
    } else {
      this.#holdFrames = 0
    }
  }

  public renderObject(object: GameObject, deltaTime: number): void {
    this.#renderer.renderObject(object, deltaTime)
  }

  public renderSubObject(object: GameObject, deltaTime: number): void {
    this.#renderer.renderSubObject(object, deltaTime)
  }

  public drawPolygon(polygon: Polygon): void {
    this.#renderer.drawPolygon(polygon)
  }

  public drawMesh(mesh: Mesh): void {
    this.#renderer.drawMesh(mesh)
  }

  public drawSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    this.#renderer.drawSprite(position, sprite, scaleX, scaleY, skewX, skewY)
  }

  public drawDistanceScaledSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    this.#renderer.drawDistanceScaledSprite(position, sprite, scaleX, scaleY, skewX, skewY)
  }

  public drawSprite2D(
    sprite: Sprite,
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  ): void {
    this.#renderer.drawSprite2D(sprite, screenX, screenY, width, height)
  }
}
