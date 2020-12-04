import Game from './Game.js'
import TickUpdatedGameObject from './TickUpdatedGameObject.js'
import Updater from './Updater.js'

export default class TickUpdater extends Updater {
  #pendingTimeDelta: number = 0

  constructor(
    private readonly tickDuration: number,
  ) {
    super()
  }

  public update(game: Game, deltaTime: number): void {
    this.#pendingTimeDelta += deltaTime
    for (const gameObject of game.gameObjects) {
      if (!(gameObject instanceof TickUpdatedGameObject)) {
        gameObject.update(game, deltaTime)
      }
    }
    while (this.#pendingTimeDelta >= this.tickDuration) {
      this.#pendingTimeDelta -= this.tickDuration
      const isLastTickInSequence = this.#pendingTimeDelta < this.tickDuration
      this.updateTick(game, isLastTickInSequence)
    }
  }

  public updateTick(game: Game, isLastTickInSequence: boolean): void {
    for (const gameObject of game.gameObjects) {
      if (gameObject instanceof TickUpdatedGameObject) {
        gameObject.updateTick(game, isLastTickInSequence)
      }
    }
  }

  public onStop(): void {
    this.#pendingTimeDelta = 0
  }
}
