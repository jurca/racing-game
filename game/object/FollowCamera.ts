import AbstractGameObject from '../../engine/AbstractGameObject.js'
import Game from '../../engine/Game.js'
import Vector3 from '../../engine/Vector3.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'
import GameObject from './GameObject.js'

export default class FollowCamera extends GameObject {
  readonly #camera: Pseudo3DCamera
  readonly #target: AbstractGameObject
  readonly #offset: Readonly<Vector3>
  readonly #springStrength: number

  constructor(
    camera: Pseudo3DCamera,
    target: AbstractGameObject,
    offset: Readonly<Vector3>,
    springStrength: number,
  ) {
    super(new Vector3(0, 0, 0))
    this.#camera = camera
    this.#target = target
    this.#offset = offset
    this.#springStrength = springStrength
  }

  public get camera(): Pseudo3DCamera {
    return this.#camera
  }

  public override updateTick(game: Game, isLastTickInSequence: boolean): void {
    super.updateTick(game, isLastTickInSequence)

    const targetAbsolute = this.#target.absolutePosition
    const targetX = targetAbsolute.x + this.#offset.x
    const targetY = targetAbsolute.y + this.#offset.y
    const targetZ = targetAbsolute.z + this.#offset.z

    const camPos = this.#camera.position
    camPos.x += (targetX - camPos.x) * this.#springStrength
    camPos.y += (targetY - camPos.y) * this.#springStrength
    camPos.z += (targetZ - camPos.z) * this.#springStrength
  }
}
