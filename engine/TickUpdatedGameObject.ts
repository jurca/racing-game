import Game from './Game.js'
import GameObject from './GameObject.js'
import {IRenderer} from './Renderer.js'

export default abstract class TickUpdatedGameObject<R extends IRenderer> extends GameObject<R> {
  public get subObjects(): ReadonlyArray<TickUpdatedGameObject<R>> {
    return super.subObjects as ReadonlyArray<TickUpdatedGameObject<R>>
  }

  public update(): never {
    throw new Error(
      'The update() method must not be used on TickUpdatedGameObject instances, use the updateTick() method instead',
    )
  }

  public updateTick(game: Game<R>): void {
    for (const gameObject of this.subObjects) {
      gameObject.updateTick(game)
    }
  }

  public addSubObject(gameObject: TickUpdatedGameObject<R>): void {
    super.addSubObject(gameObject)
  }

  public removeSubObject(gameObject: TickUpdatedGameObject<R>): void {
    super.removeSubObject(gameObject)
  }
}
