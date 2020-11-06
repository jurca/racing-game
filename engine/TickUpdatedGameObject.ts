import Game from './Game.js'
import AbstractGameObject from './AbstractGameObject.js'

export default abstract class TickUpdatedGameObject extends AbstractGameObject {
  public get subObjects(): readonly TickUpdatedGameObject[] {
    return super.subObjects as TickUpdatedGameObject[]
  }

  public update(): never {
    throw new Error(
      'The update() method must not be used on TickUpdatedGameObject instances, use the updateTick() method instead',
    )
  }

  public updateTick(game: Game): void {
    for (const gameObject of this.subObjects) {
      gameObject.updateTick(game)
    }
  }

  public addSubObject(gameObject: TickUpdatedGameObject): void {
    super.addSubObject(gameObject)
  }

  public removeSubObject(gameObject: TickUpdatedGameObject): void {
    super.removeSubObject(gameObject)
  }
}
