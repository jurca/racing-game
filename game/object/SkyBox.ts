import Renderer, {Sprite} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import GameObject from './GameObject.js'

export default class SkyBox extends GameObject {
  readonly #sprite: Sprite
  readonly #parallaxFactor: number

  constructor(sprite: Sprite, parallaxFactor: number) {
    super(new Vector3(0, 0, 0))

    this.#sprite = sprite
    this.#parallaxFactor = parallaxFactor
  }

  public render(renderer: Renderer, deltaTime: number): void {
    const {viewportWidth, viewportHeight} = renderer.camera
    const scale = viewportHeight / this.#sprite.height
    const displayW = this.#sprite.width * scale
    const xOffset = renderer.camera.position.x * this.#parallaxFactor
    let x = -(((xOffset % displayW) + displayW) % displayW)
    while (x < viewportWidth) {
      renderer.drawSprite2D(this.#sprite, x, 0, displayW, viewportHeight)
      x += displayW
    }

    super.render(renderer, deltaTime)
  }
}
