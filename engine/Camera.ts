import Point2D from './Point2D.js'
import Point3D from './Point3D.js'

export default abstract class Camera extends Point3D {
  public abstract project(point: Readonly<Point3D>): Readonly<Point2D>

  public translatePosition(absolutePosition: Readonly<Point3D>): Readonly<Point3D> {
    return absolutePosition.subtract(this)
  }
}
