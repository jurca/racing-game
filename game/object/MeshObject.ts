import Renderer, {Mesh} from '../../engine/Renderer.js'
import GameObject from './GameObject.js'

export default abstract class MeshObject extends GameObject {
  protected abstract readonly mesh: Mesh

  public render(renderer: Renderer, deltaTime: number): void {
    renderer.drawMesh(this.mesh)
    super.render(renderer, deltaTime)
  }
}
