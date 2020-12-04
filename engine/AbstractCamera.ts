import Camera from './Camera.js'
import Point2D from './Point2D.js'
import Point3D from './Point3D.js'

export default abstract class AbstractCamera implements Camera {
  protected constructor(
    public readonly viewportWidth: number,
    public readonly viewportHeight: number,
    public readonly position: Point3D,
  ) {
  }

  public abstract project(point: Readonly<Point3D>): Readonly<Point2D>

  public translatePosition(absolutePosition: Readonly<Point3D>): Readonly<Point3D> {
    return absolutePosition.subtract(this.position)
  }

  public abstract castRay(screenPoint: Readonly<Point2D>, targetDepth: number): Point3D
}
