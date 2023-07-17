export default class Color {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number,
    public readonly alpha: number = 255,
  ) {
    if (!Number.isInteger(red) || red < 0 || red > 255) {
      throw new TypeError(`The red channel must an integer in range [0, 255], ${red} was provided`)
    }
    if (!Number.isInteger(green) || green < 0 || green > 255) {
      throw new TypeError(`The green channel must an integer in range [0, 255], ${green} was provided`)
    }
    if (!Number.isInteger(blue) || blue < 0 || blue > 255) {
      throw new TypeError(`The blue channel must an integer in range [0, 255], ${blue} was provided`)
    }
    if (!Number.isInteger(alpha) || alpha < 0 || alpha > 255) {
      throw new TypeError(`The alpha channel must an integer in range [0, 255], ${alpha} was provided`)
    }

    this.asCssString = `rgba(${[this.red, this.green, this.blue, this.alpha / 255].join(', ')})`
  }

  readonly asCssString: string
}
