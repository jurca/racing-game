import Game from './Game.js'
import Renderer from './Renderer.js'
import Vector3 from './Vector3.js'

export default interface GameObject {
  readonly parent: null | GameObject
  readonly subObjects: readonly GameObject[]
  readonly position: Vector3
  readonly absolutePosition: Readonly<Vector3>

  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void

  render(renderer: Renderer, deltaTime: number): void

  addSubObject(gameObject: GameObject): void

  removeSubObject(gameObject: GameObject): void
}
