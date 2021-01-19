import Vector2 from './Vector2.js'
import Vector3 from './Vector3.js'

export default interface Camera {
  readonly viewportWidth: number
  readonly viewportHeight: number
  readonly viewportAspectRatio: number
  readonly verticalFieldOfView: number
  readonly horizontalFieldOfView: number
  readonly minVisibleDepth: number
  readonly maxVisibleDepth: number
  readonly position: Vector3

  isInVisibleDepth(point: Readonly<Vector3>): boolean

  project(point: Readonly<Vector3>): Vector2

  translatePosition(absolutePosition: Readonly<Vector3>): Vector3

  castRay(screenPoint: Readonly<Vector2>, targetDepth: number): Vector3
}
