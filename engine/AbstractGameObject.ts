import Game from './Game.js'
import GameObject from './GameObject.js'
import GameObjectCollection from './GameObjectCollection.js'
import Renderer from './Renderer.js'
import Vector3 from './Vector3.js'

export default abstract class AbstractGameObject implements GameObject {
  #parent: null | GameObject = null
  readonly #subGameObjects = new GameObjectCollection()

  constructor(
    public readonly position: Vector3,
  ) {
  }

  public get parent(): null | GameObject {
    return this.#parent
  }

  public get subObjects(): readonly GameObject[] {
    return this.#subGameObjects.gameObjects
  }

  public get absolutePosition(): Readonly<Vector3> {
    if (!this.parent) {
      return this.position
    }

    return this.parent.absolutePosition.add(this.position)
  }

  public onRun(): void {
    for (const gameObject of this.#subGameObjects.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of this.#subGameObjects.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void {
    for (const gameObject of this.#subGameObjects.gameObjects) {
      gameObject.onStop()
    }
  }

  public render(renderer: Renderer, deltaTime: number): void {
    for (const gameObject of this.#subGameObjects.gameObjects) {
      renderer.renderObject(gameObject, deltaTime)
    }
  }

  public addSubObject(gameObject: GameObject): void {
    if (gameObject.parent && gameObject.parent !== this) {
      gameObject.parent.removeSubObject(gameObject)
    }
    this.#subGameObjects.addGameObject(gameObject)
    if (gameObject instanceof AbstractGameObject) {
      gameObject.#parent = this
    }
  }

  public removeSubObject(gameObject: GameObject): void {
    this.#subGameObjects.removeGameObject(gameObject)
    if (gameObject instanceof AbstractGameObject) {
      gameObject.#parent = null
    }
  }

  public getAbsolutePosition(point: Readonly<Vector3>): Vector3 {
    return this.absolutePosition.add(point)
  }
}
