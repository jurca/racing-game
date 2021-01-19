import Renderer, {Sprite} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import GameObject from './GameObject.js'

export default class SpriteObject extends GameObject {
  readonly #sprite: Sprite
  readonly #spritePosition: Readonly<Vector3> = new Vector3(0, 0, 0)

  constructor(
    position: Vector3,
    sprite: Sprite,
    public scaleX: number = 1,
    public scaleY: number = scaleX,
  ) {
    super(position)

    this.#sprite = sprite
  }

  public render(renderer: Renderer, deltaTime: number): void {
    renderer.drawDistanceScaledSprite(this.#spritePosition, this.#sprite, this.scaleX, this.scaleY)
    super.render(renderer, deltaTime)
  }
}
