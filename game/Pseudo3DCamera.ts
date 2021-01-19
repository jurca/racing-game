import AbstractCamera from '../engine/AbstractCamera.js'
import Vector2 from '../engine/Vector2.js'
import Vector3 from '../engine/Vector3.js'

const MIN_VISIBLE_DEPTH = 64
const MAX_VISIBLE_DEPTH = Number.POSITIVE_INFINITY

export default class Pseudo3DCamera extends AbstractCamera {
  private readonly horizontalCameraDepth = 1 / Math.tan((this.horizontalFieldOfView / 2) * Math.PI / 180)
  private readonly verticalCameraDepth = 1 / Math.tan((this.verticalFieldOfView / 2) * Math.PI / 180)

  constructor(
    position: Vector3,
    viewportWidth: number,
    viewportHeight: number,
    verticalFieldOfView: number,
  ) {
    super(position, viewportWidth, viewportHeight, verticalFieldOfView, MIN_VISIBLE_DEPTH, MAX_VISIBLE_DEPTH)
  }

  public project(point: Readonly<Vector3>): Vector2 {
    const translatedPoint = this.translatePosition(point)
    const horizontalScale = this.horizontalCameraDepth / translatedPoint.z
    const verticalScale = this.verticalCameraDepth / translatedPoint.z
    const projectedPoint = new Vector2(
      translatedPoint.x * horizontalScale,
      translatedPoint.y * verticalScale,
    )
    return new Vector2(
      Math.round(this.viewportWidth / 2 + this.viewportWidth / 2 * projectedPoint.x),
      Math.round(this.viewportHeight / 2 - this.viewportHeight / 2 * projectedPoint.y),
    )
  }

  public castRay(screenPoint: Readonly<Vector2>, targetDepth: number): Vector3 {
    const projectedPoint = new Vector2(
      (screenPoint.x - this.viewportWidth / 2) / (this.viewportWidth / 2),
      -(screenPoint.y - this.viewportHeight / 2) / (this.viewportHeight / 2),
    )
    const translatedDepth = this.translatePosition(new Vector3(0, 0, targetDepth)).z
    const horizontalScale = this.horizontalCameraDepth / translatedDepth
    const verticalScale = this.verticalCameraDepth / translatedDepth
    return new Vector3(
      projectedPoint.x / horizontalScale,
      projectedPoint.y / verticalScale,
      targetDepth - this.position.z,
    ).add(this.position)
  }
}
