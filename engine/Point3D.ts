export default class Point3D {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
  ) {
  }

  public add(otherPoint: Point3D): Point3D {
    return new Point3D(
      this.x + otherPoint.x,
      this.y + otherPoint.y,
      this.z + otherPoint.z,
    )
  }

  public subtract(otherPoint: Point3D): Point3D {
    return new Point3D(
      this.x - otherPoint.x,
      this.y - otherPoint.y,
      this.z - otherPoint.z,
    )
  }
}
