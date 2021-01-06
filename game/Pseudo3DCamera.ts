import AbstractCamera from '../engine/AbstractCamera.js'
import Point2D from '../engine/Point2D.js'
import Point3D from '../engine/Point3D.js'

const MIN_VISIBLE_DEPTH = 64
const MAX_VISIBLE_DEPTH = Number.POSITIVE_INFINITY

export default class Pseudo3DCamera extends AbstractCamera {
  private readonly horizontalCameraDepth = 1 / Math.tan((this.horizontalFieldOfView / 2) * Math.PI / 180)
  private readonly verticalCameraDepth = 1 / Math.tan((this.verticalFieldOfView / 2) * Math.PI / 180)

  constructor(
    position: Point3D,
    viewportWidth: number,
    viewportHeight: number,
    verticalFieldOfView: number,
  ) {
    super(position, viewportWidth, viewportHeight, verticalFieldOfView, MIN_VISIBLE_DEPTH, MAX_VISIBLE_DEPTH)
  }

  public project(point: Readonly<Point3D>): Readonly<Point2D> {
    const translatedPoint = this.translatePosition(point)
    const horizontalScale = this.horizontalCameraDepth / translatedPoint.z
    const verticalScale = this.verticalCameraDepth / translatedPoint.z
    const projectedPoint = new Point2D(
      translatedPoint.x * horizontalScale,
      translatedPoint.y * verticalScale,
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
    const horizontalScale = this.horizontalCameraDepth / translatedDepth
    const verticalScale = this.verticalCameraDepth / translatedDepth
    return new Point3D(
      projectedPoint.x / horizontalScale,
      projectedPoint.y / verticalScale,
      targetDepth,
    ).add(this.position)
  }
}
