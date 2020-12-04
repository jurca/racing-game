import AbstractCamera from '../engine/AbstractCamera.js'
import Point2D from '../engine/Point2D.js'
import Point3D from '../engine/Point3D.js'

export default class Pseudo3DCamera extends AbstractCamera {
  private readonly cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180)

  constructor(
    public readonly fieldOfView: number,
    viewportWidth: number,
    viewportHeight: number,
    position: Point3D,
  ) {
    super(viewportWidth, viewportHeight, position)
  }

  public project(point: Readonly<Point3D>): Readonly<Point2D> {
    const translatedPoint = this.translatePosition(point)
    const scale = this.cameraDepth / translatedPoint.z
    const projectedPoint = new Point2D(
      translatedPoint.x * scale,
      translatedPoint.y * scale,
    )
    return new Point2D( // scale
      this.viewportWidth / 2 + this.viewportWidth / 2 * projectedPoint.x,
      this.viewportHeight / 2 - this.viewportHeight / 2 * projectedPoint.y,
    )
  }

  public castRay(screenPoint: Readonly<Point2D>, targetDepth: number): Point3D {
    const projectedPoint = new Point2D(
      (screenPoint.x - this.viewportWidth / 2) / (this.viewportWidth / 2),
      (this.viewportHeight / 2 - screenPoint.y) / (this.viewportHeight / 2),
    )
    const translatedDepth = this.translatePosition(new Point3D(0, 0, targetDepth)).z
    const scale = this.cameraDepth / translatedDepth
    return new Point3D(projectedPoint.x / scale, projectedPoint.y / scale, targetDepth).add(this.position)
  }
}
