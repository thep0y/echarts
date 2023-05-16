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

export function generateColors(n: number): string[] {
  const colors = []

  for (let i = 0; i < n; i++) {
    const hue = Math.floor(Math.random() * 360) // 随机生成色调值（0-359）
    const saturation = Math.floor(Math.random() * 51) + 50 // 随机生成饱和度值（50-100）
    const lightness = Math.floor(Math.random() * 41) + 30 // 随机生成亮度值（30-70）

    // 转换为 RGB 颜色空间
    const { r, g, b } = hslToRgb(hue, saturation, lightness)

    // 选择补色
    const complementaryHue = hue >= 180 ? hue - 180 : hue + 180
    const complementaryLightness =
      lightness >= 50 ? lightness - 20 : lightness + 20
    const {
      r: cr,
      g: cg,
      b: cb,
    } = hslToRgb(complementaryHue, saturation, complementaryLightness)

    // 将颜色和补色以半数概率随机组合
    const random = Math.random()
    const color = random < 0.5 ? rgbToHex(r, g, b) : rgbToHex(cr, cg, cb)

    colors.push(color)
  }

  return colors
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
