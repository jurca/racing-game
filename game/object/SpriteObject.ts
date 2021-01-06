import Point3D from '../../engine/Point3D.js'
import Renderer, {Sprite} from '../../engine/Renderer.js'
import GameObject from './GameObject.js'

export default class SpriteObject extends GameObject {
  readonly #sprite: Sprite
  readonly #spritePosition: Readonly<Point3D> = new Point3D(0, 0, 0)

  constructor(
    position: Point3D,
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
