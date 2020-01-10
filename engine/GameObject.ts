import Camera from './Camera.js'
import Game from './Game.js'
import GameObjectCollection from './GameObjectCollection.js'
import Point3D from './Point3D.js'
import {IRenderer} from './Renderer.js'

export interface IGameObject<R extends IRenderer<any>> extends Point3D {
  readonly parent: null | IGameObject<R>
  readonly subObjects: ReadonlyArray<IGameObject<R>>
  readonly absolutePosition: Readonly<Point3D>

  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void

  render(renderer: R): void

  addSubObject(gameObject: IGameObject<R>): void

  removeSubObject(gameObject: IGameObject<R>): void

  getPositionInFrame(camera: Camera): Readonly<Point3D>
}

export default abstract class GameObject<R extends IRenderer<any>> extends Point3D implements IGameObject<R> {
  private parentObject: null | GameObject<R> = null
  private subGameObjects = new GameObjectCollection<R>()

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y, z)
  }

  public get parent(): null | IGameObject<R> {
    return this.parentObject
  }

  public get subObjects(): ReadonlyArray<IGameObject<R>> {
    return this.subGameObjects.gameObjects
  }

  public get absolutePosition(): Readonly<Point3D> {
    if (!this.parent) {
      return this
    }

    return this.parent.absolutePosition.add(this)
  }

  public onRun(): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.onRun()
    }
  }

  public update(game: Game, deltaTime: number): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.onStop()
    }
  }

  public render(renderer: R): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.render(renderer)
    }
  }

  public addSubObject(gameObject: GameObject<R>): void {
    if (gameObject.parent && gameObject.parent !== this) {
      gameObject.parent.removeSubObject(gameObject)
    }
    this.subGameObjects.addGameObject(gameObject)
    gameObject.parentObject = this
  }

  public removeSubObject(gameObject: GameObject<R>): void {
    this.subGameObjects.removeGameObject(gameObject)
    gameObject.parentObject = null
  }

  public getPositionInFrame(camera: Camera): Readonly<Point3D> {
    return this.absolutePosition.subtract(camera)
  }
}
