// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#48305f',
      secondary: '#64477c',
      accent: '#221a2f',
    },
  }
})