export default function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  const image = document.createElement('img')
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error(`Failed to load the image at ${imageUrl}`)))
    image.src = imageUrl
  })
}
