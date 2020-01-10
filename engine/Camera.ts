import {IGameObject} from './GameObject.js'
import Point3D from './Point3D.js'
import {IRenderer} from './Renderer.js'

export default class Camera extends Point3D {
  public getViewSpacePosition(gameObject: IGameObject<IRenderer>): Readonly<Point3D> {
    return gameObject.absolutePosition.subtract(this)
  }
}
