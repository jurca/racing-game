import Camera from './Camera.js'
import Game from './Game.js'

export interface IRenderer {
  readonly camera: Camera

  render(game: Game<this>, deltaTime: number): void
}
