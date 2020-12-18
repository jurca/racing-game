import {lerp} from './util.js'

export default class Point3D {
  public static lerp(start: Readonly<Point3D>, end: Readonly<Point3D>, progress: number): Point3D {
    return new Point3D(
      lerp(start.x, end.x, progress),
      lerp(start.y, end.y, progress),
      lerp(start.z, end.z, progress),
    )
  }

  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
  ) {
  }

  public add(otherPoint: Readonly<Point3D>): Point3D {
    return new Point3D(
      this.x + otherPoint.x,
      this.y + otherPoint.y,
      this.z + otherPoint.z,
    )
  }

  public subtract(otherPoint: Readonly<Point3D>): Point3D {
    return new Point3D(
      this.x - otherPoint.x,
      this.y - otherPoint.y,
      this.z - otherPoint.z,
    )
  }

  public lerpTo(end: Readonly<Point3D>, progress: number): Point3D {
    return Point3D.lerp(this, end, progress)
  }
}
