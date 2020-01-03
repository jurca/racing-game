import Game from './Game.js'

export interface IUpdater {
  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void
}

export abstract class TickUpdater implements IUpdater {
  private pendingTimeDelta: number = 0

  constructor(
    private readonly tickDuration: number,
  ) {
  }

  public onRun(): void {
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
