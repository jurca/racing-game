import {IGameObject} from './GameObject.js'
import Point2D from './Point2D.js'
import Point3D from './Point3D.js'
import {IRenderer} from './Renderer.js'

export default abstract class Camera extends Point3D {
  public getGameObjectViewSpacePosition(gameObject: IGameObject<IRenderer>): Readonly<Point3D> {
    return this.getViewSpacePosition(gameObject.absolutePosition)
  }

  public getViewSpacePosition(point: Readonly<Point3D>): Readonly<Point3D> {
    return point.subtract(this)
  }

  public abstract getViewportPosition(point: Readonly<Point3D>): Point2D
}
