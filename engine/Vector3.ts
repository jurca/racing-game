import {lerp} from './util.js'

export default class Vector3 {
  public static lerp(start: Readonly<Vector3>, end: Readonly<Vector3>, progress: number): Vector3 {
    return start.lerpTo(end, progress)
  }

  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
  ) {
  }

  public add(otherPoint: Readonly<Vector3>): Vector3 {
    return new Vector3(
      this.x + otherPoint.x,
      this.y + otherPoint.y,
      this.z + otherPoint.z,
    )
  }

  public subtract(otherPoint: Readonly<Vector3>): Vector3 {
    return new Vector3(
      this.x - otherPoint.x,
      this.y - otherPoint.y,
      this.z - otherPoint.z,
    )
  }

  public lerpTo(end: Readonly<Vector3>, progress: number): Vector3 {
    return new Vector3(
      lerp(this.x, end.x, progress),
      lerp(this.y, end.y, progress),
      lerp(this.z, end.z, progress),
    )
  }
}
