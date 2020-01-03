import Game from './Game.js'
import GameObjectCollection from './GameObjectCollection.js'
import {IRenderer} from './Renderer.js'

export interface IGameObject<R extends IRenderer<any>> {
  readonly subObjects: ReadonlyArray<IGameObject<R>>

  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void

  render(renderer: R): void

  addSubObject(gameObject: IGameObject<R>): void

  removeSubObject(gameObject: IGameObject<R>): void
}

export default abstract class GameObject<R extends IRenderer<any>> implements IGameObject<R> {
  private subGameObjects = new GameObjectCollection<R>()

  public get subObjects(): ReadonlyArray<IGameObject<R>> {
    return this.subGameObjects.gameObjects
  }

  public onRun(): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.onStop()
    }
  }

  public render(renderer: R): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.render(renderer)
    }
  }

  public addSubObject(gameObject: IGameObject<R>): void {
    this.subGameObjects.addGameObject(gameObject)
  }

  public removeSubObject(gameObject: IGameObject<R>): void {
    this.subGameObjects.removeGameObject(gameObject)
  }
}
