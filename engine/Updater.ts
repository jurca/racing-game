import Game from './Game.js'

export interface IUpdater {
  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void
}

export default abstract class Updater implements IUpdater {
  public onRun(): void { // tslint:disable-line:no-empty
  }

  public abstract update(game: Game, deltaTime: number): void

  public onStop(): void { // tslint:disable-line:no-empty
  }
}
