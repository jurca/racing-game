import Camera from './Camera.js'
import Game from './Game.js'

export interface IRenderer<C extends Camera> {
  readonly camera: C

  render(game: Game<C, this>, deltaTime: number): void
}

export default abstract class Renderer<C extends Camera> implements IRenderer<C> {
  protected constructor(
    public readonly camera: C,
  ) {
  }

  public render(game: Game<C, Renderer<C>>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.render(this, deltaTime)
    }
  }
}
