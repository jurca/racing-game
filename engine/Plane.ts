import Ray from './Ray.js'
import Vector3 from './Vector3.js'

export default class Plane {
  constructor(
    public readonly origin: Readonly<Vector3>,
    public readonly normal: Readonly<Vector3>,
  ) {
  }

  intersect(ray: Ray): Vector3 | null {
    const denominator = this.normal.dot(ray.direction)
    if (denominator === 0) {
      return null
    }

    const distanceToIntersection = this.normal.dot(this.origin.subtract(ray.origin)) / denominator
    if (distanceToIntersection < 0) {
      return null
    }

    return ray.origin.add(ray.direction.scale(distanceToIntersection))
  }
}
