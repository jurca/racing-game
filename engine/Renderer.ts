import Camera from './Camera.js'
import Game from './Game.js'

export interface IRenderer {
  readonly camera: Camera

  render(game: Game<this>, deltaTime: number): void
}

export default abstract class Renderer implements IRenderer {
  protected constructor(
    public readonly camera: Camera,
  ) {
  }

  public render(game: Game<Renderer>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.render(this, deltaTime)
    }
  }
}
