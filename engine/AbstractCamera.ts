import Camera from './Camera.js'
import Vector2 from './Vector2.js'
import Vector3 from './Vector3.js'

export default abstract class AbstractCamera implements Camera {
  protected constructor(
    public readonly position: Vector3,
    public readonly viewportWidth: number,
    public readonly viewportHeight: number,
    public readonly verticalFieldOfView: number,
    public readonly minVisibleDepth: number,
    public readonly maxVisibleDepth: number,
  ) {
  }

  public get viewportAspectRatio(): number {
    return this.viewportWidth / this.viewportHeight
  }

  public get horizontalFieldOfView(): number {
    return 2 * Math.atan(Math.tan(this.verticalFieldOfView * 0.5) * this.viewportAspectRatio)
  }

  public get viewportBottomDirection(): Vector3 {
    return new Vector3(0, 0, 1).rotateX(this.verticalFieldOfView / 2)
  }

  public isInVisibleDepth(point: Readonly<Vector3>): boolean {
    const translatedPoint = this.translatePosition(point)
    return translatedPoint.z >= this.minVisibleDepth && translatedPoint.z <= this.maxVisibleDepth
  }

  public abstract project(point: Readonly<Vector3>): Vector2

  public translatePosition(absolutePosition: Readonly<Vector3>): Vector3 {
    return absolutePosition.subtract(this.position)
  }

  public abstract castRay(screenPoint: Readonly<Vector2>, targetDepth: number): Vector3
}
