import { computed, inject } from 'vue';
import type { ComputedRef } from 'vue';
import { UI_CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants';
import type { ConfigProviderContext } from '../config-provider/types';

/**
 * Shared UI-layer locale messages for the theme components (`ThemeCustomizer`,
 * `ThemeModeSelect`, `ThemeModeSegment` and `PalettePicker`).
 *
 * Only Simplified Chinese (`zh`) and English are supported: a Chinese UI locale
 * renders the `zh` labels, every other locale falls back to English.
 */
export interface ThemeLocaleMessages {
  /** Section and control labels (mode / palette / base / radius / …). */
  sections: {
    mode: string;
    palette: string;
    base: string;
    primary: string;
    radius: string;
    size: string;
    spacing: string;
    font: string;
    fontSans: string;
    fontHeading: string;
    fontMono: string;
    fontSerif: string;
    scheme: string;
    feedback: string;
    sidebar: string;
    advanced: string;
    theme: string;
    custom: string;
    menu: string;
    borderOpacity: string;
    surfaceStyle: string;
    cssVars: string;
    reset: string;
  };
  /** Variant group labels (surfaces / hairlines / …). */
  groups: {
    surfaces: string;
    fills: string;
    hairlines: string;
    brand: string;
    sidebar: string;
    feedback: string;
    charts: string;
  };
  /** Variant token labels (background / card / primary / …). */
  variants: {
    background: string;
    card: string;
    popover: string;
    carbon: string;
    mask: string;
    foreground: string;
    mutedForeground: string;
    cardForeground: string;
    popoverForeground: string;
    carbonForeground: string;
    muted: string;
    accent: string;
    accentForeground: string;
    secondary: string;
    secondaryForeground: string;
    border: string;
    input: string;
    ring: string;
    primary: string;
    primaryForeground: string;
    sidebar: string;
    sidebarForeground: string;
    sidebarBorder: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarRing: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    info: string;
    infoForeground: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  /** Select option labels (feedback scheme and menu settings). */
  options: {
    mode: {
      auto: string;
      light: string;
      dark: string;
    };
    size: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xl2: string;
    };
    spacing: {
      compact: string;
      default: string;
      relaxed: string;
      spacious: string;
    };
    /**
     * Font family labels, keyed by family (not by role).
     *
     * The four font roles (`sans` / `heading` / `mono` / `serif`) all draw from
     * this one catalog — a heading may be any family, and the same family is
     * spelled the same wherever it appears — so a family is labelled once
     * instead of once per role.
     */
    fontFamilies: {
      system: string;
      geist: string;
      inter: string;
      notoSans: string;
      nunitoSans: string;
      figtree: string;
      roboto: string;
      raleway: string;
      dmSans: string;
      publicSans: string;
      outfit: string;
      oxanium: string;
      manrope: string;
      spaceGrotesk: string;
      montserrat: string;
      ibmPlexSans: string;
      sourceSans3: string;
      instrumentSans: string;
      jetbrainsMono: string;
      geistMono: string;
      notoSerif: string;
      robotoSlab: string;
      merriweather: string;
      lora: string;
      playfairDisplay: string;
      ebGaramond: string;
      instrumentSerif: string;
    };
    feedback: {
      classic: string;
      vivid: string;
      subtle: string;
      modern: string;
      professional: string;
    };
    sidebar: {
      derived: string;
      invertedDark: string;
      soft: string;
      contrast: string;
    };
    surfaceStyle: {
      layered: string;
      flat: string;
    };
  };
  /** Labels used by the `PalettePicker` component. */
  palettePicker: {
    /** Label for the custom color option. */
    custom: string;
    /** Label for the recommended palette switch. */
    recommendedPalette: string;
  };
}

const themeLocaleEn: ThemeLocaleMessages = {
  sections: {
    mode: 'Mode',
    palette: 'Palette',
    base: 'Base',
    primary: 'Primary',
    radius: 'Radius',
    size: 'Size',
    spacing: 'Spacing',
    font: 'Font',
    fontSans: 'Sans',
    fontHeading: 'Heading',
    fontMono: 'Mono',
    fontSerif: 'Serif',
    scheme: 'Scheme',
    feedback: 'Feedback',
    sidebar: 'Sidebar',
    advanced: 'Advanced',
    theme: 'Theme',
    custom: 'Custom',
    menu: 'Menu',
    borderOpacity: 'Border Opacity',
    surfaceStyle: 'Surface Style',
    cssVars: 'CSS Variable Theme',
    reset: 'Reset'
  },
  groups: {
    surfaces: 'Surfaces',
    fills: 'Fills',
    hairlines: 'Hairlines',
    brand: 'Brand',
    sidebar: 'Sidebar',
    feedback: 'Status',
    charts: 'Charts'
  },
  variants: {
    background: 'Background',
    card: 'Card',
    popover: 'Popover',
    carbon: 'Carbon',
    mask: 'Mask',
    foreground: 'Foreground',
    mutedForeground: 'Muted Foreground',
    cardForeground: 'Card Foreground',
    popoverForeground: 'Popover Foreground',
    carbonForeground: 'Carbon Foreground',
    muted: 'Muted',
    accent: 'Accent',
    accentForeground: 'Accent Foreground',
    secondary: 'Secondary',
    secondaryForeground: 'Secondary Foreground',
    border: 'Border',
    input: 'Input',
    ring: 'Ring',
    primary: 'Primary',
    primaryForeground: 'Primary Foreground',
    sidebar: 'Sidebar',
    sidebarForeground: 'Sidebar Foreground',
    sidebarBorder: 'Sidebar Border',
    sidebarAccent: 'Sidebar Accent',
    sidebarAccentForeground: 'Sidebar Accent Foreground',
    sidebarPrimary: 'Sidebar Primary',
    sidebarPrimaryForeground: 'Sidebar Primary Foreground',
    sidebarRing: 'Sidebar Ring',
    destructive: 'Destructive',
    destructiveForeground: 'Destructive Foreground',
    success: 'Success',
    successForeground: 'Success Foreground',
    warning: 'Warning',
    warningForeground: 'Warning Foreground',
    info: 'Info',
    infoForeground: 'Info Foreground',
    chart1: 'Chart 1',
    chart2: 'Chart 2',
    chart3: 'Chart 3',
    chart4: 'Chart 4',
    chart5: 'Chart 5'
  },
  options: {
    mode: {
      auto: 'auto',
      light: 'light',
      dark: 'dark'
    },
    size: {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      xl2: '2xl'
    },
    spacing: {
      compact: 'compact',
      default: 'default',
      relaxed: 'relaxed',
      spacious: 'spacious'
    },
    fontFamilies: {
      system: 'system',
      geist: 'Geist',
      inter: 'Inter',
      notoSans: 'Noto Sans',
      nunitoSans: 'Nunito Sans',
      figtree: 'Figtree',
      roboto: 'Roboto',
      raleway: 'Raleway',
      dmSans: 'DM Sans',
      publicSans: 'Public Sans',
      outfit: 'Outfit',
      oxanium: 'Oxanium',
      manrope: 'Manrope',
      spaceGrotesk: 'Space Grotesk',
      montserrat: 'Montserrat',
      ibmPlexSans: 'IBM Plex Sans',
      sourceSans3: 'Source Sans 3',
      instrumentSans: 'Instrument Sans',
      jetbrainsMono: 'JetBrains Mono',
      geistMono: 'Geist Mono',
      notoSerif: 'Noto Serif',
      robotoSlab: 'Roboto Slab',
      merriweather: 'Merriweather',
      lora: 'Lora',
      playfairDisplay: 'Playfair Display',
      ebGaramond: 'EB Garamond',
      instrumentSerif: 'Instrument Serif'
    },
    feedback: {
      classic: 'classic',
      vivid: 'vivid',
      subtle: 'subtle',
      modern: 'modern',
      professional: 'professional'
    },
    sidebar: {
      derived: 'Derived',
      invertedDark: 'Inverted Dark',
      soft: 'Soft',
      contrast: 'Contrast'
    },
    surfaceStyle: {
      layered: 'layered',
      flat: 'flat'
    }
  },
  palettePicker: {
    custom: 'Custom',
    recommendedPalette: 'Recommended palette'
  }
};

const themeLocaleZh: ThemeLocaleMessages = {
  sections: {
    mode: '模式',
    palette: '调色板',
    base: '基础色',
    primary: '主色',
    radius: '圆角',
    size: '尺寸',
    spacing: '间距',
    font: '字体',
    fontSans: '无衬线',
    fontHeading: '标题',
    fontMono: '等宽',
    fontSerif: '衬线',
    scheme: '配色方案',
    feedback: '反馈',
    sidebar: '侧边栏',
    advanced: '高级',
    theme: '主题',
    custom: '自定义',
    menu: '菜单',
    borderOpacity: '边框透明度',
    surfaceStyle: '表面风格',
    cssVars: 'CSS变量主题',
    reset: '重置'
  },
  groups: {
    surfaces: '表面',
    fills: '填充',
    hairlines: '描边',
    brand: '品牌',
    sidebar: '侧边栏',
    feedback: '状态',
    charts: '图表'
  },
  variants: {
    background: '背景',
    card: '卡片面',
    popover: '浮层面',
    carbon: '反相面',
    mask: '遮罩',
    foreground: '前景文字',
    mutedForeground: '次要文字',
    cardForeground: '卡片文字',
    popoverForeground: '浮层文字',
    carbonForeground: '反相文字',
    muted: '弱化面',
    accent: '交互面',
    accentForeground: '交互面文字',
    secondary: '次级',
    secondaryForeground: '次级文字',
    border: '分隔线',
    input: '输入框边界',
    ring: '焦点环',
    primary: '主色',
    primaryForeground: '主色前景',
    sidebar: '侧栏基底',
    sidebarForeground: '侧栏文字',
    sidebarBorder: '侧栏边界',
    sidebarAccent: '侧栏交互面',
    sidebarAccentForeground: '侧栏交互面文字',
    sidebarPrimary: '侧栏强调色',
    sidebarPrimaryForeground: '侧栏强调色前景',
    sidebarRing: '侧栏焦点环',
    destructive: '危险',
    destructiveForeground: '危险前景',
    success: '成功',
    successForeground: '成功前景',
    warning: '警告',
    warningForeground: '警告前景',
    info: '信息',
    infoForeground: '信息前景',
    chart1: '图表 1',
    chart2: '图表 2',
    chart3: '图表 3',
    chart4: '图表 4',
    chart5: '图表 5'
  },
  options: {
    mode: {
      auto: '自动',
      light: '浅色',
      dark: '深色'
    },
    size: {
      xs: '特小',
      sm: '小',
      md: '中',
      lg: '大',
      xl: '特大',
      xl2: '超大'
    },
    spacing: {
      compact: '紧凑',
      default: '默认',
      relaxed: '宽松',
      spacious: '宽敞'
    },
    fontFamilies: {
      system: '系统',
      geist: 'Geist',
      inter: 'Inter',
      notoSans: 'Noto Sans',
      nunitoSans: 'Nunito Sans',
      figtree: 'Figtree',
      roboto: 'Roboto',
      raleway: 'Raleway',
      dmSans: 'DM Sans',
      publicSans: 'Public Sans',
      outfit: 'Outfit',
      oxanium: 'Oxanium',
      manrope: 'Manrope',
      spaceGrotesk: 'Space Grotesk',
      montserrat: 'Montserrat',
      ibmPlexSans: 'IBM Plex Sans',
      sourceSans3: 'Source Sans 3',
      instrumentSans: 'Instrument Sans',
      jetbrainsMono: 'JetBrains Mono',
      geistMono: 'Geist Mono',
      notoSerif: 'Noto Serif',
      robotoSlab: 'Roboto Slab',
      merriweather: 'Merriweather',
      lora: 'Lora',
      playfairDisplay: 'Playfair Display',
      ebGaramond: 'EB Garamond',
      instrumentSerif: 'Instrument Serif'
    },
    feedback: {
      classic: '经典',
      vivid: '鲜明',
      subtle: '柔和',
      modern: '现代',
      professional: '专业'
    },
    sidebar: {
      derived: '派生',
      invertedDark: '反转深色',
      soft: '柔和',
      contrast: '高对比'
    },
    surfaceStyle: {
      layered: '层叠',
      flat: '扁平'
    }
  },
  palettePicker: {
    custom: '自定义',
    recommendedPalette: '推荐色板'
  }
};

/**
 * Resolve the shared theme locale messages for the current UI locale.
 *
 * Chinese (`zh`-prefixed) locales use the `zh` labels; every other locale
 * (including the default `en`) falls back to English.
 */
export function useThemeLocale(): ComputedRef<ThemeLocaleMessages> {
  const config = inject<ConfigProviderContext>(UI_CONFIG_PROVIDER_CONTEXT_KEY);

  return computed(() => {
    const locale = config?.locale ?? 'en';

    return locale.startsWith('zh') ? themeLocaleZh : themeLocaleEn;
  });
}
