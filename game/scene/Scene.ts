import Point3D from '../../engine/Point3D.js'
import GameObject from '../object/GameObject.js'

export default class Scene extends GameObject {
  constructor() {
    super(new Point3D(0, 0, 0))
  }
}
