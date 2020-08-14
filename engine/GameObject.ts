import Camera from './Camera.js'
import Game from './Game.js'
import GameObjectCollection from './GameObjectCollection.js'
import Point3D from './Point3D.js'
import {IRenderer} from './Renderer.js'

export interface IGameObject<C extends Camera, R extends IRenderer<C>> extends Point3D {
  readonly parent: null | IGameObject<C, R>
  readonly subObjects: ReadonlyArray<IGameObject<C, R>>
  readonly absolutePosition: Readonly<Point3D>

  onRun(): void

  update(game: Game<C, R>, deltaTime: number): void

  onStop(): void

  render(renderer: R, deltaTime: number): void

  addSubObject(gameObject: IGameObject<C, R>): void

  removeSubObject(gameObject: IGameObject<C, R>): void
}

export default abstract class GameObject<C extends Camera, R extends IRenderer<C>>
    extends Point3D
    implements IGameObject<C, R> {
  private parentObject: null | GameObject<C, R> = null
  private readonly subGameObjects = new GameObjectCollection<C, R>()

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y, z)
  }

  public get parent(): null | IGameObject<C, R> {
    return this.parentObject
  }

  public get subObjects(): ReadonlyArray<IGameObject<C, R>> {
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

  public update(game: Game<C, R>, deltaTime: number): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.update(game, deltaTime)
    }
  }

  public onStop(): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.onStop()
    }
  }

  public render(renderer: R, deltaTime: number): void {
    for (const gameObject of this.subGameObjects.gameObjects) {
      gameObject.render(renderer, deltaTime)
    }
  }

  public addSubObject(gameObject: GameObject<C, R>): void {
    if (gameObject.parent && gameObject.parent !== this) {
      gameObject.parent.removeSubObject(gameObject)
    }
    this.subGameObjects.addGameObject(gameObject)
    gameObject.parentObject = this
  }

  public removeSubObject(gameObject: GameObject<C, R>): void {
    this.subGameObjects.removeGameObject(gameObject)
    gameObject.parentObject = null
  }

  public getAbsolutePosition(point: Point3D): Point3D {
    return this.absolutePosition.add(point)
  }
}
