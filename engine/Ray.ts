import Vector3 from './Vector3.js'

export default class Ray {
  constructor(
    public readonly origin: Vector3,
    public readonly direction: Vector3,
  ) {
  }
}
