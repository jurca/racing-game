import Game from './Game.js'
import {IRenderer} from './Renderer.js'

export interface IUpdater {
  onRun(game: Game<IRenderer>): void

  update(game: Game<IRenderer>, deltaTime: number): void

  onStop(game: Game<IRenderer>): void
}

export default class Updater implements IUpdater {
  public onRun(game: Game<IRenderer>): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game<IRenderer>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(game: Game<IRenderer>): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onStop()
    }
  }
}
