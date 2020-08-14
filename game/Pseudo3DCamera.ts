import Camera from '../engine/Camera.js'
import Point2D from '../engine/Point2D.js'
import Point3D from '../engine/Point3D.js'

export default class Pseudo3DCamera extends Camera {
  private readonly cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180)

  constructor(
    public readonly fieldOfView: number,
    viewportWidth: number,
    viewportHeight: number,
    x: number = 0,
    y: number = 0,
    z: number = 0,
  ) {
    super(viewportWidth, viewportHeight, x, y, z)
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
}
