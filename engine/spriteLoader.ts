import loadImage from './imageLoader.js'
import {Sprite} from './Renderer.js'
import getSprite from './spriteExtractor.js'

export interface SpritesConfiguration {
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
  spritesConfiguration: SpritesConfiguration,
): Promise<{[spriteId: string]: Sprite}> {
  const images = await Promise.all(Object.keys(spritesConfiguration).map(
    (imageUrl) => loadImage(imageUrl).then((image) => [imageUrl, image] as [string, HTMLImageElement]),
  ))
  return images.map(
    ([imageUrl, image]) => {
      const spriteConfigs = spritesConfiguration[imageUrl]
      return Object.fromEntries(Object.entries(spriteConfigs).map(
        ([spriteId, spriteConfig]) => {
          const spriteData = getSprite(image, spriteConfig.x, spriteConfig.y, spriteConfig.width, spriteConfig.height)
          return [
            spriteId,
            new Sprite(spriteData, spriteData.width, spriteData.height),
          ]
        },
      ))
    },
  ).reduce((allSprites, spritePack) => Object.assign(allSprites, spritePack), {})
}
