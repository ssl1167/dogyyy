const illustrations = [
  'beagle-jumping',
  'bichon',
  'black-labrador',
  'boston-terrier',
  'bull-terrier',
  'chihuahua',
  'corgi',
  'dalmatian',
  'doberman-sitting',
  'french-bulldog',
  'golden-retriever',
  'jack-russell',
  'miniature-pinscher',
  'papillon',
  'pug',
  'schnauzer',
  'shiba',
  'westie',
] as const

const photos = [
  '05a361bacc8ce0655229978a5840a9fd.jpg',
  '06450b735266787edb102790b55e6094.jpg',
  '1a3802f5e51c8cb120124b508f764b6b.jpg',
  '25ba770b95ea07c009483f8c5683bb71.jpg',
  '2d1899e71ac7447c8850931dabd832d6.jpg',
  '2e67bdcc66b649d44acde175a1090599.jpg',
  '2e77e5ae8a00a0444d8fe8e867ea519a.jpg',
  '308df27d6f60dfb47feba9f2b2123a92.jpg',
  '3d75b7d18644f0d92be6aee7385e0040.jpg',
  '4773d9f432f50810f2a26c5694eefee9.jpg',
  '656c35a272066c1b7628d2aea88f1f42.jpg',
  '6f39f9301bd5ad316760888934c4aacc.jpg',
  '87db6781d860e8dd0f1f3356fb266286.jpg',
  '978749708c68cecf0015b05ac8999480.jpg',
  '99a0bf2ce31523aabd505c9b31e9de8d.jpg',
  'a287f123a758be4c1389f68220a1d791.jpg',
  'adc0cd973ba42cf8bf36a74640461353.jpg',
  'b6b9550c9fac50cab9c8581c62303b89.jpg',
  'ba5760b36b0ce32151fc3f4663431e16.jpg',
  'bdea91561b9187986d9fab0abcb62814.jpg',
  'c1c1bf849d601816d8ec0f0fd9e47243.jpg',
  'c95fceb16290c2153cb97c42549679e8.jpg',
  'e072a19afe2ec92423107a3fc0d0cb9c.jpg',
  'f1cf7932399956d7b38fa51f564834ed.jpg',
  'f6591a65c40948791f96ce2e058cdb6c.jpg',
] as const

export const dogGalleryImages = [
  ...illustrations.map((name) => `/assets/dogs/dog-${name}.png`),
  ...photos.map((name) => `/assets/dogs/gallery/${name}`),
]

export type DogCardLayout = {
  src: string
  size: number
  rotate: number
  yOffset: number
  lift: number
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 999.91) * 43758.5453
  return value - Math.floor(value)
}

function shuffle<T>(items: T[], seed: number) {
  const list = [...items]
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(seededRandom(seed + index) * (index + 1))
    ;[list[index], list[swapIndex]] = [list[swapIndex], list[index]]
  }
  return list
}

export function buildDogCards(images: string[], seed: number): DogCardLayout[] {
  return images.map((src, index) => ({
    src,
    size: 78 + seededRandom(seed + index * 5) * 92,
    rotate: -16 + seededRandom(seed + index * 5 + 1) * 32,
    yOffset: -22 + seededRandom(seed + index * 5 + 2) * 44,
    lift: seededRandom(seed + index * 5 + 3) > 0.72 ? 1 : 0,
  }))
}

export function buildDogParadeLanes() {
  const shuffled = shuffle(dogGalleryImages, 20240622)
  const chunk = Math.ceil(shuffled.length / 3)
  return [
    { duration: 58, cards: buildDogCards(shuffled.slice(0, chunk), 11) },
    { duration: 42, cards: buildDogCards(shuffled.slice(chunk, chunk * 2), 29) },
    { duration: 74, cards: buildDogCards(shuffled.slice(chunk * 2), 47) },
  ]
}
