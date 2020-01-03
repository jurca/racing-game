import {IGameObject} from './GameObject.js'
import {IRenderer} from './Renderer.js'

export interface IGameObjectCollection<R extends IRenderer<any>> {
  readonly gameObjects: ReadonlyArray<IGameObject<R>>

  addGameObject(gameObject: IGameObject<R>): void

  removeGameObject(gameObject: IGameObject<R>): void
}

export default class GameObjectCollection<R extends IRenderer<any>> implements IGameObjectCollection<R> {
  public readonly gameObjects: ReadonlyArray<IGameObject<R>> = []

  public addGameObject(gameObject: IGameObject<R>): void {
    if (!this.gameObjects.includes(gameObject)) {
      (this.gameObjects as Array<IGameObject<R>>).push(gameObject)
    }
  }

  public removeGameObject(gameObject: IGameObject<R>): void {
    const index = this.gameObjects.indexOf(gameObject)
    if (index > -1) {
      (this.gameObjects as Array<IGameObject<R>>).splice(index, 1)
    }
  }
}
