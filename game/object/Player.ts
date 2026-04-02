import Game from '../../engine/Game.js'
import Renderer, {Sprite} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import GameObject from './GameObject.js'

export default class Player extends GameObject {
  #speed: number = 0
  readonly #sprite: Sprite
  readonly #spriteScaleX
  readonly #spriteScaleY
  readonly #acceleration: number
  readonly #deceleration: number
  readonly #maxSpeed: number

  constructor(
    position: Vector3,
    sprite: Sprite,
    spriteScaleX: number,
    spriteScaleY: number,
    acceleration: number,
    deceleration: number,
    maxSpeed: number,
  ) {
    super(position)
    this.#sprite = sprite
    this.#spriteScaleX = spriteScaleX
    this.#spriteScaleY = spriteScaleY
    this.#acceleration = acceleration
    this.#deceleration = deceleration
    this.#maxSpeed = maxSpeed
  }

  public override updateTick(game: Game, isLastTickInSequence: boolean): void {
    super.updateTick(game, isLastTickInSequence)

    if (game.pressedKeys['ArrowUp']) {
      this.#speed = Math.min(this.#speed + this.#acceleration, this.#maxSpeed)
    }
    if (game.pressedKeys['ArrowDown']) {
      this.#speed = Math.max(this.#speed - this.#deceleration, 0)
    }

    this.position.z += this.#speed
  }

  public override render(renderer: Renderer, deltaTime: number): void {
    renderer.drawDistanceScaledSprite(new Vector3(0, 0, 0), this.#sprite, this.#spriteScaleX, this.#spriteScaleY)
    super.render(renderer, deltaTime)
  }
}
