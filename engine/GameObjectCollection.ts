import Camera from './Camera.js'
import {IGameObject} from './GameObject.js'
import {IRenderer} from './Renderer.js'

export interface IGameObjectCollection<C extends Camera, R extends IRenderer<C>> {
  readonly gameObjects: ReadonlyArray<IGameObject<C, R>>

  addGameObject(gameObject: IGameObject<C, R>): void

  removeGameObject(gameObject: IGameObject<C, R>): void
}

export default class GameObjectCollection<C extends Camera, R extends IRenderer<C>>
implements IGameObjectCollection<C, R> {
  public readonly gameObjects: ReadonlyArray<IGameObject<C, R>> = []

  public addGameObject(gameObject: IGameObject<C, R>): void {
    if (!this.gameObjects.includes(gameObject)) {
      (this.gameObjects as Array<IGameObject<C, R>>).push(gameObject)
    }
  }

  public removeGameObject(gameObject: IGameObject<C, R>): void {
    const index = this.gameObjects.indexOf(gameObject)
    if (index > -1) {
      (this.gameObjects as Array<IGameObject<C, R>>).splice(index, 1)
    }
  }
}
