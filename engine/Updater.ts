import Game from './Game.js'

export default class Updater {
  public onRun(game: Game): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(game: Game): void {
    for (const gameObject of game.gameObjects) {
      gameObject.onStop()
    }
  }
}
