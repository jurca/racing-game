export default function getSprite(
  spriteSheet: HTMLImageElement | HTMLCanvasElement,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = width
  sprite.height = height
  const spriteRenderingContext = sprite.getContext('2d')
  if (!spriteRenderingContext) {
    throw new Error('Cannot create sprite - failed to create a 2D rendering context')
  }
  spriteRenderingContext.drawImage(spriteSheet, offsetX, offsetY, width, height, 0, 0, width, height)
  return sprite
}
