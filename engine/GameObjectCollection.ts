import GameObject from './GameObject.js'

export default class GameObjectCollection implements GameObjectCollection {
  readonly #gameObjects: GameObject[] = []

  public get gameObjects(): readonly GameObject[] {
    return this.#gameObjects
  }

  public addGameObject(gameObject: GameObject): void {
    if (!this.#gameObjects.includes(gameObject)) {
      this.#gameObjects.push(gameObject)
    }
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.#gameObjects.indexOf(gameObject)
    if (index > -1) {
      this.#gameObjects.splice(index, 1)
    }
  }
}
