import Camera from './Camera.js'
import {IGameObjectCollection} from './GameObjectCollection.js'

export interface IRenderer<R extends IRenderer<any>> extends IGameObjectCollection<R> {
  readonly camera: Camera

  render(deltaTime: number): void
}
