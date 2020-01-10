import Camera from '../engine/Camera.js'
import Point2D from '../engine/Point2D.js'
import Point3D from '../engine/Point3D.js'

export default class Pseudo3DCamera extends Camera {
  constructor(
    public fieldOfView: number,
    public width: number,
    public height: number,
    x: number = 0,
    y: number = 0,
    z: number = 0,
  ) {
    super(x, y, z)
  }

  public project(point: Readonly<Point3D>): Readonly<Point2D> {
    const cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180)
    const translatedPoint = this.translatePosition(point)
    const scale = cameraDepth / translatedPoint.z
    const projectedPoint = new Point2D(
      translatedPoint.x * scale,
      translatedPoint.y * scale,
    )
    return new Point2D( // scale
      this.width / 2 + this.width / 2 * projectedPoint.x,
      this.height / 2 - this.height / 2 * projectedPoint.y,
    )
  }
}
