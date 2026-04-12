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
  readonly #maxSteeringSpeed: number
  readonly #steeringAcceleration: number
  readonly #strongestSteeringSpeedFraction: number
  readonly #highSpeedSteeringEffectiveness: number
  #steeringSpeed: number = 0

  constructor(
    position: Vector3,
    sprite: Sprite,
    spriteScaleX: number,
    spriteScaleY: number,
    acceleration: number,
    deceleration: number,
    maxSpeed: number,
    maxSteeringSpeed: number,
    steeringAcceleration: number,
    strongestSteeringSpeedFraction: number,
    highSpeedSteeringEffectiveness: number,
  ) {
    super(position)
    this.#sprite = sprite
    this.#spriteScaleX = spriteScaleX
    this.#spriteScaleY = spriteScaleY
    this.#acceleration = acceleration
    this.#deceleration = deceleration
    this.#maxSpeed = maxSpeed
    this.#maxSteeringSpeed = maxSteeringSpeed
    this.#steeringAcceleration = steeringAcceleration
    this.#strongestSteeringSpeedFraction = strongestSteeringSpeedFraction
    this.#highSpeedSteeringEffectiveness = highSpeedSteeringEffectiveness
  }

  public override updateTick(game: Game, isLastTickInSequence: boolean): void {
    super.updateTick(game, isLastTickInSequence)

    if (game.pressedKeys['ArrowUp']) {
      this.#speed = Math.min(this.#speed + this.#acceleration, this.#maxSpeed)
    }
    if (game.pressedKeys['ArrowDown']) {
      this.#speed = Math.max(this.#speed - this.#deceleration, 0)
    }

    let targetSteeringSpeed = 0
    if (game.pressedKeys['ArrowLeft']) {
      targetSteeringSpeed -= this.#maxSteeringSpeed
    }
    if (game.pressedKeys['ArrowRight']) {
      targetSteeringSpeed += this.#maxSteeringSpeed
    }

    if (this.#steeringSpeed < targetSteeringSpeed) {
      this.#steeringSpeed = Math.min(this.#steeringSpeed + this.#steeringAcceleration, targetSteeringSpeed)
    } else if (this.#steeringSpeed > targetSteeringSpeed) {
      this.#steeringSpeed = Math.max(this.#steeringSpeed - this.#steeringAcceleration, targetSteeringSpeed)
    }

    const strongestSteeringSpeed = this.#strongestSteeringSpeedFraction * this.#maxSpeed
    let steeringMultiplier = 1.0

    if (this.#speed < strongestSteeringSpeed) {
      // Phase 1: Linear increase from 0 to 1.0 as speed approaches peakSpeed
      steeringMultiplier = strongestSteeringSpeed > 0 ? this.#speed / strongestSteeringSpeed : 0
    } else {
      // Phase 2: Linear decay from 1.0 to highSpeedEffectiveness as speed approaches maxSpeed
      const denominator = this.#maxSpeed - strongestSteeringSpeed
      if (denominator > 0) {
        const scaler = 1.0 - this.#highSpeedSteeringEffectiveness
        steeringMultiplier = 1.0 - ((this.#speed - strongestSteeringSpeed) / denominator) * scaler
      } else {
        // Guard against division by zero if peakSpeed === maxSpeed
        steeringMultiplier = this.#highSpeedSteeringEffectiveness
      }
    }

    this.position.z += this.#speed
    this.position.x += this.#steeringSpeed * steeringMultiplier
  }

  public override render(renderer: Renderer, deltaTime: number): void {
    renderer.drawDistanceScaledSprite(new Vector3(0, 0, 0), this.#sprite, this.#spriteScaleX, this.#spriteScaleY)
    super.render(renderer, deltaTime)
  }
}
