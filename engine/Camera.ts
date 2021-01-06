import Point2D from './Point2D.js'
import Point3D from './Point3D.js'

export default interface Camera {
  readonly viewportWidth: number
  readonly viewportHeight: number
  readonly viewportAspectRatio: number
  readonly verticalFieldOfView: number
  readonly horizontalFieldOfView: number
  readonly minVisibleDepth: number
  readonly maxVisibleDepth: number
  readonly position: Point3D

  isInVisibleDepth(point: Readonly<Point3D>): boolean

  project(point: Readonly<Point3D>): Point2D

  translatePosition(absolutePosition: Readonly<Point3D>): Point3D

  castRay(screenPoint: Readonly<Point2D>, targetDepth: number): Point3D
}
