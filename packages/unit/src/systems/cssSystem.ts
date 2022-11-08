import createSystem from '../createSystem'
import createSystemFactory from '../createSystemFactory'

const cssSystem = createSystem({
  constants: {
    rootFontSize: 18,
    fontSize: 18,
    width: 0,
    height: 0,
    viewWidth: 1920,
    viewHeight: 1080,
    pixelRatio: 1,
    zeroWidth: 16,
  },
  from: {
    px: value => value,
    vw: (value, { viewWidth }) => (value / 100) * viewWidth,
    vh: (value, { viewHeight }) => (value / 100) * viewHeight,
    vmin: (value, { viewWidth, viewHeight }) =>
      ((value / 100) * Math.min(viewWidth, viewHeight)) / (1 / 100),
    vmax: (value, { viewWidth, viewHeight }) =>
      ((value / 100) * Math.max(viewWidth, viewHeight)) / (1 / 100),
    rem: (value, { rootFontSize }) => rootFontSize * value,
    em: (value, { fontSize }) => fontSize * value,
    '%': (value, { width }) => (value / 100) * width,
    'h%': (value, { height }) => (value / 100) * height,
    mm: (value, { pixelRatio }) => value * 3.7795276 * pixelRatio,
    cm: (value, { pixelRatio }) => value * 37.795276 * pixelRatio,
    in: (value, { pixelRatio }) => value * 96 * pixelRatio,
    pt: (value, { pixelRatio }) => value * 1.333333 * pixelRatio,
    pc: (value, { pixelRatio }) => value * 16 * pixelRatio,
    ch: (value, { zeroWidth }) => zeroWidth * value,
  },
  to: {
    px: value => value,
    vw: (value, { viewWidth }) => (value / viewWidth) * 100,
    vh: (value, { viewHeight }) => (value / viewHeight) * 100,
    vmin: (value, { viewWidth, viewHeight }) =>
      ((value / Math.min(viewWidth, viewHeight)) * 100) / (1 / 100),
    vmax: (value, { viewWidth, viewHeight }) =>
      ((value / Math.max(viewWidth, viewHeight)) * 100) / (1 / 100),
    rem: (value, { rootFontSize }) => value / rootFontSize,
    em: (value, { fontSize }) => value / fontSize,
    '%': (value, { width }) => (value / width) * 100,
    'h%': (value, { height }) => (value / height) * 100,
    mm: (value, { pixelRatio }) => value / pixelRatio / 3.7795276,
    cm: (value, { pixelRatio }) => value / pixelRatio / 37.795276,
    in: (value, { pixelRatio }) => value / pixelRatio / 96,
    pt: (value, { pixelRatio }) => value / pixelRatio / 1.333333,
    pc: (value, { pixelRatio }) => value / pixelRatio / 16,
    ch: (value, { zeroWidth }) => value / zeroWidth,
  },
  baseUnit: 'px',
})

export const createCssSystem = createSystemFactory(cssSystem)

export default cssSystem
