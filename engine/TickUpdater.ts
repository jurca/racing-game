import Game from './Game.js'
import {IRenderer} from './Renderer.js'
import Updater from './Updater.js'

export default abstract class TickUpdater extends Updater {
  private pendingTimeDelta: number = 0

  protected constructor(
    private readonly tickDuration: number,
  ) {
    super()
  }

  public update(game: Game<IRenderer>, deltaTime: number): void {
    this.pendingTimeDelta += deltaTime
    while (this.pendingTimeDelta >= this.tickDuration) {
      this.updateTick(game)
      this.pendingTimeDelta -= this.tickDuration
    }
  }

  public abstract updateTick(game: Game<IRenderer>): void

  public onStop(): void {
    this.pendingTimeDelta = 0
  }
}
