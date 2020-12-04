import Point2D from './Point2D.js'
import Point3D from './Point3D.js'

export default interface Camera {
  readonly viewportWidth: number
  readonly viewportHeight: number
  readonly position: Point3D

  project(point: Readonly<Point3D>): Point2D

  translatePosition(absolutePosition: Readonly<Point3D>): Point3D

  castRay(screenPoint: Readonly<Point2D>, targetDepth: number): Point3D
}
