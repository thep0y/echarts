export const generateRandomColors = (n: number): string[] => {
  const colorArray: string[] = []
  const tooLight = 230
  const tooDark = 30

  for (let i = 0; i < n; i++) {
    let r, g, b

    do {
      r = Math.floor(Math.random() * 256)
      g = Math.floor(Math.random() * 256)
      b = Math.floor(Math.random() * 256)
    } while (
      (r > tooLight && g > tooLight && b > tooLight) ||
      (r < tooDark && g < tooDark && b < tooDark)
    )

    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

    while (colorArray.indexOf(hex) !== -1) {
      r = Math.floor(Math.random() * 256)
      g = Math.floor(Math.random() * 256)
      b = Math.floor(Math.random() * 256)
      hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }

    colorArray.push(hex)
  }

  return colorArray
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getComplementaryColor(color: string) {
  const red = parseInt(color.substr(0, 2), 16)
  const green = parseInt(color.substr(2, 2), 16)
  const blue = parseInt(color.substr(4, 2), 16)
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const sum = max + min
  const complement = `#${(255 - red).toString(16).padStart(2, '0')}${(
    255 - green
  )
    .toString(16)
    .padStart(2, '0')}${(255 - blue).toString(16).padStart(2, '0')}`

  return { complement, sum }
}

export function generateColors(n: number) {
  const colors: string[] = []
  let hue = getRandomInt(360)

  for (let i = 0; i < n; i++) {
    // Generate primary color
    const saturation = 60 + getRandomInt(40)
    let lightness = 30 + getRandomInt(40)
    const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    const hexColor = `#${primaryColor
      .substring(4, primaryColor.length - 1)
      .split(', ')
      .map((c) => parseInt(c).toString(16).padStart(2, '0'))
      .join('')}`

    colors.push(hexColor)
    // Generate complementary color
    const { complement, sum } = getComplementaryColor(hexColor.substring(1))

    if (sum > 400) {
      lightness = lightness - 10
    } else if (sum < 200) {
      lightness = lightness + 10
    }
    const complementaryColor = `#${complement.substring(1)}`

    colors.push(complementaryColor)
    hue = (hue + 137) % 360 // Use golden ratio angle for hue
  }

  return colors
}
