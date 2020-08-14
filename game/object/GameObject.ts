import Canvas2DRenderer from '../../engine/Canvas2DRenderer'
import TickUpdatedGameObject from '../../engine/TickUpdatedGameObject.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'

export default class GameObject extends TickUpdatedGameObject<Pseudo3DCamera, Canvas2DRenderer<Pseudo3DCamera>> {
}
