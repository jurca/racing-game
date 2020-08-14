import CanvasRenderer from '../../engine/Canvas2DRenderer'
import Game from '../../engine/Game.js'
import TickUpdatedGameObject from '../../engine/TickUpdatedGameObject.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'

export default class GameObject extends TickUpdatedGameObject<Pseudo3DCamera, CanvasRenderer<Pseudo3DCamera>> {
  constructor(
    public readonly game: Game<Pseudo3DCamera, CanvasRenderer<Pseudo3DCamera>>,
    x: number = 0, y: number = 0, z: number = 0,
  ) {
    super(x, y, z)
  }
}
