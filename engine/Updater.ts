import Camera from './Camera.js'
import Game from './Game.js'
import {IRenderer} from './Renderer.js'

export interface IUpdater {
  onRun(game: Game<Camera, IRenderer<Camera>>): void

  update(game: Game<Camera, IRenderer<Camera>>, deltaTime: number): void

  onStop(game: Game<Camera, IRenderer<Camera>>): void
}

export default class Updater implements IUpdater {
  public onRun(game: Game<Camera, IRenderer<Camera>>): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game<Camera, IRenderer<Camera>>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(game: Game<Camera, IRenderer<Camera>>): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onStop()
    }
  }
}
