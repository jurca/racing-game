import Vector3 from '../../engine/Vector3.js'
import GameObject from '../object/GameObject.js'

export default class Scene extends GameObject {
  constructor() {
    super(new Vector3(0, 0, 0))
  }
}
