import Camera from './Camera.js'
import Game from './Game.js'
import {IRenderer} from './Renderer.js'
import TickUpdatedGameObject from './TickUpdatedGameObject.js'
import Updater from './Updater.js'

export default class TickUpdater extends Updater {
  private pendingTimeDelta: number = 0

  constructor(
    private readonly tickDuration: number,
  ) {
    super()
  }

  public update(game: Game<Camera, IRenderer<Camera>>, deltaTime: number): void {
    this.pendingTimeDelta += deltaTime
    for (const gameObject of game.gameObjects) {
      if (!(gameObject instanceof TickUpdatedGameObject)) {
        gameObject.update(game, deltaTime)
      }
    }
    while (this.pendingTimeDelta >= this.tickDuration) {
      this.updateTick(game)
      this.pendingTimeDelta -= this.tickDuration
    }
  }

  public updateTick(game: Game<Camera, IRenderer<Camera>>): void {
    for (const gameObject of game.gameObjects) {
      if (gameObject instanceof TickUpdatedGameObject) {
        gameObject.updateTick(game)
      }
    }
  }

  public onStop(): void {
    this.pendingTimeDelta = 0
  }
}
