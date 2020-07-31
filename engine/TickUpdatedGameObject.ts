import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import {IRenderer} from './Renderer.js'

export default abstract class TickUpdatedGameObject<C extends Camera, R extends IRenderer<C>> extends GameObject<C, R> {
  public get subObjects(): ReadonlyArray<TickUpdatedGameObject<C, R>> {
    return super.subObjects as ReadonlyArray<TickUpdatedGameObject<C, R>>
  }

  public update(): never {
    throw new Error(
      'The update() method must not be used on TickUpdatedGameObject instances, use the updateTick() method instead',
    )
  }

  public updateTick(game: Game<C, R>): void {
    for (const gameObject of this.subObjects) {
      gameObject.updateTick(game)
    }
  }

  public addSubObject(gameObject: TickUpdatedGameObject<C, R>): void {
    super.addSubObject(gameObject)
  }

  public removeSubObject(gameObject: TickUpdatedGameObject<C, R>): void {
    super.removeSubObject(gameObject)
  }
}
