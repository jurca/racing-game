import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import Renderer, {Mesh, Polygon, Sprite} from './Renderer.js'
import Point3D from './Point3D.js'

export default abstract class AbstractRenderer implements Renderer {
  protected constructor(
    public readonly camera: Camera,
  ) {
  }

  public render(game: Game, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      this.renderObject(gameObject, deltaTime)
    }
  }

  public renderObject(object: GameObject, deltaTime: number): void {
    object.render(this, deltaTime)
  }

  public abstract drawPolygon(polygon: Polygon): void

  public drawMesh(mesh: Mesh): void {
    for (const polygon of mesh) {
      this.drawPolygon(polygon)
    }
  }

  public abstract drawSprite(
    position: Readonly<Point3D>,
    sprite: Sprite,
    scaleX?: number,
    scaleY?: number,
    skewX?: number,
    skewY?: number,
  ): void

  public abstract drawDistanceScaledSprite(
    position: Readonly<Point3D>,
    sprite: Sprite,
    scaleX?: number,
    scaleY?: number,
    skewX?: number,
    skewY?: number,
  ): void
}
