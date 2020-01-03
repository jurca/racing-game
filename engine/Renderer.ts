import {IGameObjectCollection} from './GameObjectCollection.js'

export interface IRenderer<R extends IRenderer<any>> extends IGameObjectCollection<R> {
  render(deltaTime: number): void
}
