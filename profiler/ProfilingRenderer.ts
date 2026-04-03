import Camera from '../engine/Camera.js'
import Game from '../engine/Game.js'
import Renderer, {Mesh, Polygon, Sprite} from '../engine/Renderer.js'
import Vector3 from '../engine/Vector3.js'
import GameObject from '../game/object/GameObject.js'

export default class ProfilingRenderer implements Renderer {
  readonly #renderer: Renderer
  readonly #frameDurations: number[] = []
  #warmupTime: number = 250

  constructor(renderer: Renderer) {
    this.#renderer = renderer
  }

  get frameDurationStats() {
    const durations = this.#frameDurations
    return {
      minFrameDuration: Math.min(...durations),
      maxFrameDuration: Math.max(...durations),
      avgFrameDuration: durations.reduce(
        (average, duration, _, durations) => average + duration / durations.length,
        0,
      ),
    }
  }

  get camera(): Camera {
    return this.#renderer.camera
  }

  render(game: Game, deltaTime: number): void {
    this.#renderer.render(game, deltaTime)

    if (this.#warmupTime) {
      // During the initial warmup period, we skip profiling to allow the game to stabilize.
      this.#warmupTime -= Math.min(this.#warmupTime, deltaTime)
      return
    }

    this.#frameDurations.push(deltaTime)
  }

  renderObject(object: GameObject, deltaTime: number): void {
    this.#renderer.renderObject(object, deltaTime)
  }

  renderSubObject(object: GameObject, deltaTime: number): void {
    this.#renderer.renderSubObject(object, deltaTime)
  }

  drawPolygon(polygon: Polygon): void {
    this.#renderer.drawPolygon(polygon)
  }

  drawMesh(mesh: Mesh): void {
    this.#renderer.drawMesh(mesh)
  }

  drawSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    this.#renderer.drawSprite(position, sprite, scaleX, scaleY, skewX, skewY)
  }

  drawDistanceScaledSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    this.#renderer.drawDistanceScaledSprite(position, sprite, scaleX, scaleY, skewX, skewY)
  }

  drawSprite2D(
    sprite: Sprite,
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  ): void {
    this.#renderer.drawSprite2D(sprite, screenX, screenY, width, height)
  }
}
