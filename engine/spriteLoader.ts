import loadImage from './imageLoader.js'
import getSprite from './spriteExtractor.js'

export interface ISpritesConfiguration {
  [imageSrc: string]: {
    [spriteId: string]: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
}

export default async function loadSprites(
  spritesConfiguration: ISpritesConfiguration,
): Promise<{[spriteId: string]: HTMLCanvasElement}> {
  const images = await Promise.all(Object.keys(spritesConfiguration).map(
    (imageUrl) => loadImage(imageUrl).then((image) => [imageUrl, image] as [string, HTMLImageElement]),
  ))
  return images.map(
    ([imageUrl, image]) => {
      const spriteConfigs = spritesConfiguration[imageUrl]
      return Object.fromEntries(Object.entries(spriteConfigs).map(
        ([spriteId, spriteConfig]) => [
          spriteId,
          getSprite(
            image,
            spriteConfig.x,
            spriteConfig.y,
            spriteConfig.width,
            spriteConfig.height,
          ),
        ],
      ))
    },
  ).reduce((allSprites, spritePack) => Object.assign(allSprites, spritePack), {})
}