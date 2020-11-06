import Game from './Game.js'
import GameObject from './GameObject.js'
import GameObjectCollection from './GameObjectCollection.js'
import Point3D from './Point3D.js'
import Renderer from './Renderer.js'

export default abstract class AbstractGameObject implements GameObject {
  #parent: null | GameObject = null
  readonly #subGameObjects = new GameObjectCollection()

  constructor(
    public position: Point3D,
  ) {
  }

  public get parent(): null | GameObject {
    return this.#parent
  }

  public get subObjects(): readonly GameObject[] {
    return this.#subGameObjects.gameObjects
  }

  public get absolutePosition(): Readonly<Point3D> {
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
      gameObject.render(renderer, deltaTime)
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

  public getAbsolutePosition(point: Point3D): Point3D {
    return this.absolutePosition.add(point)
  }
}
