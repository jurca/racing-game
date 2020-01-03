import Game from './Game.js'
import GameObjectCollection, {IGameObjectCollection} from './GameObjectCollection.js'
import {IRenderer} from './Renderer.js'

export interface IUpdater extends IGameObjectCollection<IRenderer<any>> {
  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void
}

export default class Updater extends GameObjectCollection<IRenderer<any>> implements IUpdater {
  public onRun(): void {
    for (const gameObject of this.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of this.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void {
    for (const gameObject of this.gameObjects) {
      gameObject.onStop()
    }
  }
}
