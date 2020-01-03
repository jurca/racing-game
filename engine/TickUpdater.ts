import Game from './Game.js'
import Updater from './Updater.js'

export abstract class TickUpdater extends Updater {
  private pendingTimeDelta: number = 0

  constructor(
    private readonly tickDuration: number,
  ) {
    super()
  }

  public update(game: Game, deltaTime: number): void {
    this.pendingTimeDelta += deltaTime
    while (this.pendingTimeDelta >= this.tickDuration) {
      this.updateTick(game)
      this.pendingTimeDelta -= this.tickDuration
    }
  }

  public abstract updateTick(game: Game): void

  public onStop(): void {
    this.pendingTimeDelta = 0
  }
}
