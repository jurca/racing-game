import Game from './Game.js'
import {IRenderer} from './Renderer.js'

export interface IGameObject<R extends IRenderer> {
  readonly subObjects: ReadonlyArray<IGameObject<R>>

  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void

  render(renderer: R): void

  addSubObject(gameObject: IGameObject<R>): void

  removeSubObject(gameObject: IGameObject<R>): void
}

export default abstract class GameObject<R extends IRenderer> implements IGameObject<R> {
  private subGameObjects: Array<IGameObject<R>> = []

  public get subObjects(): ReadonlyArray<IGameObject<R>> {
    return this.subGameObjects
  }

  public onRun(): void { // tslint:disable-line:no-empty
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of this.subGameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void { // tslint:disable-line:no-empty
  }

  public render(renderer: R): void {
    for (const gameObject of this.subGameObjects) {
      gameObject.render(renderer)
    }
  }

  public addSubObject(gameObject: IGameObject<R>): void {
    if (!this.subGameObjects.includes(gameObject)) {
      this.subGameObjects.push(gameObject)
    }
  }

  public removeSubObject(gameObject: IGameObject<R>): void {
    const index = this.subGameObjects.indexOf(gameObject)
    if (index > -1) {
      this.subGameObjects.splice(index, 1)
    }
  }
}
