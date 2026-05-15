export const packageBoundary = {
  name: "@your-org/forms-themes",
  responsibility: "optional starter tokens and removable theme assets",
  phase: "theme-design-system-readiness"
} as const;

export type ThemeTokenCategory = "colors" | "typography" | "spacing" | "radii" | "shadows" | "motion" | "components";

export interface ThemeTokens {
  colors: ThemeColorTokens;
  typography: ThemeTypographyTokens;
  spacing: ThemeSpacingTokens;
  radii: ThemeRadiusTokens;
  shadows: ThemeShadowTokens;
  motion: ThemeMotionTokens;
  components: ThemeComponentTokens;
}

export interface ThemeColorTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  accent: string;
  onAccent: string;
  surface: string;
  surfaceMuted: string;
  surfaceRaised: string;
  surfaceInverse: string;
  onSurface: string;
  onSurfaceMuted: string;
  onSurfaceInverse: string;
  border: string;
  borderStrong: string;
  outlineFocus: string;
  success: string;
  onSuccess: string;
  successSurface: string;
  successBorder: string;
  warning: string;
  onWarning: string;
  warningSurface: string;
  warningBorder: string;
  danger: string;
  onDanger: string;
  dangerSurface: string;
  dangerBorder: string;
  info: string;
  onInfo: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface ThemeTypographyTokens {
  fontSans: string;
  fontRtl: string;
  fontMono: string;
  h1: ThemeTextStyle;
  h2: ThemeTextStyle;
  h3: ThemeTextStyle;
  bodyMd: ThemeTextStyle;
  bodySm: ThemeTextStyle;
  labelMd: ThemeTextStyle;
  labelSm: ThemeTextStyle;
}

export interface ThemeTextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
}

export interface ThemeSpacingTokens {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  fieldGap: string;
  inlineGap: string;
  panelPadding: string;
  canvasGap: string;
  sectionGap: string;
}

export interface ThemeRadiusTokens {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  pill: string;
}

export interface ThemeShadowTokens {
  none: string;
  level1: string;
  level2: string;
}

export interface ThemeMotionTokens {
  fast: string;
  normal: string;
  easing: string;
}

export interface ThemeComponentTokens {
  buttonHeight: string;
  iconButtonSize: string;
  inputHeight: string;
  badgeHeight: string;
  builderCommandBarHeight: string;
  builderPaletteWidth: string;
  builderInspectorWidth: string;
  builderCanvasMaxWidth: string;
}

export interface ThemeCssOptions {
  selector?: string;
  includeCompatibilityAliases?: boolean;
}

export interface IranYekanFontOptions {
  fontFamily?: string;
  assetBasePath?: string;
  selector?: string;
}

export type ThemeVariableName = `--rfb-${string}`;
export type ThemeVariableEntries = ReadonlyArray<readonly [ThemeVariableName, string]>;

export const defaultThemeTokens = {
  colors: {
    primary: "#315CFF",
    onPrimary: "#FFFFFF",
    primaryContainer: "#E8EDFF",
    onPrimaryContainer: "#12205C",
    secondary: "#42526B",
    onSecondary: "#FFFFFF",
    accent: "#087568",
    onAccent: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F6F7FB",
    surfaceRaised: "#FFFFFF",
    surfaceInverse: "#151923",
    onSurface: "#172033",
    onSurfaceMuted: "#667085",
    onSurfaceInverse: "#FFFFFF",
    border: "#DDE3EE",
    borderStrong: "#AEB8C8",
    outlineFocus: "#315CFF",
    success: "#147A4D",
    onSuccess: "#FFFFFF",
    successSurface: "#ECFDF3",
    successBorder: "#B7E4CB",
    warning: "#9A6500",
    onWarning: "#FFFFFF",
    warningSurface: "#FFF7E6",
    warningBorder: "#FFE0A3",
    danger: "#B42318",
    onDanger: "#FFFFFF",
    dangerSurface: "#FFF2F0",
    dangerBorder: "#FFD6D0",
    info: "#155EEF",
    onInfo: "#FFFFFF",
    chart1: "#315CFF",
    chart2: "#087568",
    chart3: "#B42318",
    chart4: "#6D3EF2",
    chart5: "#8A5A00"
  },
  typography: {
    fontSans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontRtl: "Vazirmatn, Noto Sans Arabic, Tahoma, system-ui, sans-serif",
    fontMono: "'Roboto Mono', 'SFMono-Regular', Consolas, monospace",
    h1: { fontFamily: "var(--rfb-font-sans)", fontSize: "32px", fontWeight: 700, lineHeight: "40px", letterSpacing: "0px" },
    h2: { fontFamily: "var(--rfb-font-sans)", fontSize: "24px", fontWeight: 700, lineHeight: "32px", letterSpacing: "0px" },
    h3: { fontFamily: "var(--rfb-font-sans)", fontSize: "20px", fontWeight: 650, lineHeight: "28px", letterSpacing: "0px" },
    bodyMd: { fontFamily: "var(--rfb-font-sans)", fontSize: "16px", fontWeight: 400, lineHeight: "24px", letterSpacing: "0px" },
    bodySm: { fontFamily: "var(--rfb-font-sans)", fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0px" },
    labelMd: { fontFamily: "var(--rfb-font-sans)", fontSize: "14px", fontWeight: 600, lineHeight: "20px", letterSpacing: "0px" },
    labelSm: { fontFamily: "var(--rfb-font-sans)", fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0px" }
  },
  spacing: {
    none: "0",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
    fieldGap: "6px",
    inlineGap: "8px",
    panelPadding: "16px",
    canvasGap: "12px",
    sectionGap: "24px"
  },
  radii: {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    pill: "999px"
  },
  shadows: {
    none: "none",
    level1: "0 1px 2px rgba(15,23,42,.08)",
    level2: "0 12px 32px rgba(15,23,42,.14)"
  },
  motion: {
    fast: "120ms",
    normal: "160ms",
    easing: "ease"
  },
  components: {
    buttonHeight: "40px",
    iconButtonSize: "36px",
    inputHeight: "38px",
    badgeHeight: "24px",
    builderCommandBarHeight: "56px",
    builderPaletteWidth: "280px",
    builderInspectorWidth: "340px",
    builderCanvasMaxWidth: "760px"
  }
} as const satisfies ThemeTokens;

export const defaultThemeVariableEntries = [
  ["--rfb-color-primary", defaultThemeTokens.colors.primary],
  ["--rfb-color-on-primary", defaultThemeTokens.colors.onPrimary],
  ["--rfb-color-primary-container", defaultThemeTokens.colors.primaryContainer],
  ["--rfb-color-on-primary-container", defaultThemeTokens.colors.onPrimaryContainer],
  ["--rfb-color-secondary", defaultThemeTokens.colors.secondary],
  ["--rfb-color-on-secondary", defaultThemeTokens.colors.onSecondary],
  ["--rfb-color-accent", defaultThemeTokens.colors.accent],
  ["--rfb-color-on-accent", defaultThemeTokens.colors.onAccent],
  ["--rfb-color-surface", defaultThemeTokens.colors.surface],
  ["--rfb-color-surface-muted", defaultThemeTokens.colors.surfaceMuted],
  ["--rfb-color-surface-raised", defaultThemeTokens.colors.surfaceRaised],
  ["--rfb-color-surface-inverse", defaultThemeTokens.colors.surfaceInverse],
  ["--rfb-color-on-surface", defaultThemeTokens.colors.onSurface],
  ["--rfb-color-on-surface-muted", defaultThemeTokens.colors.onSurfaceMuted],
  ["--rfb-color-on-surface-inverse", defaultThemeTokens.colors.onSurfaceInverse],
  ["--rfb-color-border", defaultThemeTokens.colors.border],
  ["--rfb-color-border-strong", defaultThemeTokens.colors.borderStrong],
  ["--rfb-color-focus", defaultThemeTokens.colors.outlineFocus],
  ["--rfb-color-success", defaultThemeTokens.colors.success],
  ["--rfb-color-on-success", defaultThemeTokens.colors.onSuccess],
  ["--rfb-color-success-surface", defaultThemeTokens.colors.successSurface],
  ["--rfb-color-success-border", defaultThemeTokens.colors.successBorder],
  ["--rfb-color-warning", defaultThemeTokens.colors.warning],
  ["--rfb-color-on-warning", defaultThemeTokens.colors.onWarning],
  ["--rfb-color-warning-surface", defaultThemeTokens.colors.warningSurface],
  ["--rfb-color-warning-border", defaultThemeTokens.colors.warningBorder],
  ["--rfb-color-danger", defaultThemeTokens.colors.danger],
  ["--rfb-color-on-danger", defaultThemeTokens.colors.onDanger],
  ["--rfb-color-danger-surface", defaultThemeTokens.colors.dangerSurface],
  ["--rfb-color-danger-border", defaultThemeTokens.colors.dangerBorder],
  ["--rfb-color-info", defaultThemeTokens.colors.info],
  ["--rfb-color-on-info", defaultThemeTokens.colors.onInfo],
  ["--rfb-font-sans", defaultThemeTokens.typography.fontSans],
  ["--rfb-font-rtl", defaultThemeTokens.typography.fontRtl],
  ["--rfb-font-mono", defaultThemeTokens.typography.fontMono],
  ["--rfb-space-0", defaultThemeTokens.spacing.none],
  ["--rfb-space-1", defaultThemeTokens.spacing.xs],
  ["--rfb-space-2", defaultThemeTokens.spacing.sm],
  ["--rfb-space-3", defaultThemeTokens.spacing.md],
  ["--rfb-space-4", defaultThemeTokens.spacing.lg],
  ["--rfb-space-5", defaultThemeTokens.spacing.xl],
  ["--rfb-space-6", defaultThemeTokens.spacing["2xl"]],
  ["--rfb-space-8", defaultThemeTokens.spacing["3xl"]],
  ["--rfb-space-10", defaultThemeTokens.spacing["4xl"]],
  ["--rfb-space-field-gap", defaultThemeTokens.spacing.fieldGap],
  ["--rfb-space-inline-gap", defaultThemeTokens.spacing.inlineGap],
  ["--rfb-space-panel-padding", defaultThemeTokens.spacing.panelPadding],
  ["--rfb-space-canvas-gap", defaultThemeTokens.spacing.canvasGap],
  ["--rfb-space-section-gap", defaultThemeTokens.spacing.sectionGap],
  ["--rfb-radius-none", defaultThemeTokens.radii.none],
  ["--rfb-radius-xs", defaultThemeTokens.radii.xs],
  ["--rfb-radius-sm", defaultThemeTokens.radii.sm],
  ["--rfb-radius-md", defaultThemeTokens.radii.md],
  ["--rfb-radius-lg", defaultThemeTokens.radii.lg],
  ["--rfb-radius-pill", defaultThemeTokens.radii.pill],
  ["--rfb-shadow-none", defaultThemeTokens.shadows.none],
  ["--rfb-shadow-level-1", defaultThemeTokens.shadows.level1],
  ["--rfb-shadow-level-2", defaultThemeTokens.shadows.level2],
  ["--rfb-motion-fast", defaultThemeTokens.motion.fast],
  ["--rfb-motion-normal", defaultThemeTokens.motion.normal],
  ["--rfb-motion-easing", defaultThemeTokens.motion.easing],
  ["--rfb-component-button-height", defaultThemeTokens.components.buttonHeight],
  ["--rfb-component-icon-button-size", defaultThemeTokens.components.iconButtonSize],
  ["--rfb-component-input-height", defaultThemeTokens.components.inputHeight],
  ["--rfb-component-badge-height", defaultThemeTokens.components.badgeHeight],
  ["--rfb-component-builder-command-bar-height", defaultThemeTokens.components.builderCommandBarHeight],
  ["--rfb-component-builder-palette-width", defaultThemeTokens.components.builderPaletteWidth],
  ["--rfb-component-builder-inspector-width", defaultThemeTokens.components.builderInspectorWidth],
  ["--rfb-component-builder-canvas-max-width", defaultThemeTokens.components.builderCanvasMaxWidth]
] as const satisfies ThemeVariableEntries;

export function createThemeVariables(options: ThemeCssOptions = {}): string {
  const selector = options.selector ?? ":where(.rfb-theme, .rfb-form, .rfb-builder)";
  const entries = options.includeCompatibilityAliases === false
    ? defaultThemeVariableEntries
    : [...defaultThemeVariableEntries, ...compatibilityVariableEntries];
  return `${selector}{${entries.map(([name, value]) => `${name}:${value};`).join("")}}`;
}

export function createRendererThemeStyles(options: ThemeCssOptions = {}): string {
  return [
    createThemeVariables(options),
    rendererThemeCss,
    reducedMotionCss
  ].join("\n");
}

export function createBuilderThemeStyles(options: ThemeCssOptions = {}): string {
  return [
    createThemeVariables(options),
    builderThemeCss,
    reducedMotionCss
  ].join("\n");
}

export function createDefaultThemeStyles(options: ThemeCssOptions = {}): string {
  return [
    createThemeVariables(options),
    rendererThemeCss,
    builderThemeCss,
    reducedMotionCss
  ].join("\n");
}

export function createFocusThemeStyles(): string {
  return focusCss;
}

export function createReducedMotionStyles(): string {
  return reducedMotionCss;
}

export function createIranYekanFontFace(options: IranYekanFontOptions = {}): string {
  const family = options.fontFamily ?? "IRANYekanXFaNum";
  const basePath = (options.assetBasePath ?? "/assets/fonts/iranyekan").replace(/\/$/, "");
  const selector = options.selector ?? ":where(.rfb-theme, .rfb-form, .rfb-builder)";
  return [
    `@font-face{font-family:"${family}";src:url("${basePath}/IRANYekanXFaNum-Regular.woff2") format("woff2"),url("${basePath}/IRANYekanXFaNum-Regular.woff") format("woff");font-weight:400;font-style:normal;font-display:swap;}`,
    `@font-face{font-family:"${family}";src:url("${basePath}/IRANYekanXFaNum-Bold.woff2") format("woff2"),url("${basePath}/IRANYekanXFaNum-Bold.woff") format("woff");font-weight:700;font-style:normal;font-display:swap;}`,
    `${selector}{--rfb-font-rtl:"${family}",Vazirmatn,Noto Sans Arabic,Tahoma,system-ui,sans-serif;}`
  ].join("\n");
}

const compatibilityVariableEntries = [
  ["--rfb-field-gap", "var(--rfb-space-field-gap)"],
  ["--rfb-border-color", "var(--rfb-color-border)"],
  ["--rfb-error-color", "var(--rfb-color-danger)"],
  ["--fb-primary", "var(--rfb-color-primary)"],
  ["--fb-on-primary", "var(--rfb-color-on-primary)"],
  ["--fb-primary-container", "var(--rfb-color-primary-container)"],
  ["--fb-on-primary-container", "var(--rfb-color-on-primary-container)"],
  ["--fb-accent", "var(--rfb-color-accent)"],
  ["--fb-surface", "var(--rfb-color-surface)"],
  ["--fb-surface-muted", "var(--rfb-color-surface-muted)"],
  ["--fb-on-surface", "var(--rfb-color-on-surface)"],
  ["--fb-muted", "var(--rfb-color-on-surface-muted)"],
  ["--fb-border", "var(--rfb-color-border)"],
  ["--fb-border-strong", "var(--rfb-color-border-strong)"],
  ["--fb-danger", "var(--rfb-color-danger)"],
  ["--fb-warning", "var(--rfb-color-warning)"],
  ["--fb-success", "var(--rfb-color-success)"],
  ["--fb-info", "var(--rfb-color-info)"],
  ["--fb-focus", "var(--rfb-color-focus)"],
  ["--fb-radius", "var(--rfb-radius-md)"],
  ["--fb-radius-sm", "var(--rfb-radius-sm)"],
  ["--fb-shadow", "var(--rfb-shadow-level-1)"]
] as const satisfies ReadonlyArray<readonly [string, string]>;

const focusCss = [
  ".rfb-form :is(button,input,textarea,select,[tabindex]):focus-visible,.rfb-builder :is(button,input,textarea,select,[tabindex]):focus-visible{outline:3px solid var(--rfb-color-focus);outline-offset:2px;}",
  ".rfb-form :is(button,input,textarea,select):disabled,.rfb-builder :is(button,input,textarea,select):disabled{cursor:not-allowed;opacity:.52;}"
].join("\n");

const rendererThemeCss = [
  ".rfb-form{display:grid;gap:var(--rfb-space-4);color:var(--rfb-color-on-surface);font-family:var(--rfb-font-sans);}",
  ".rfb-form[dir=\"rtl\"],.rfb-form :dir(rtl){font-family:var(--rfb-font-rtl);}",
  ".rfb-form-title{font:700 24px/32px var(--rfb-font-sans);letter-spacing:0;margin:0;}",
  ".rfb-form-description,.rfb-description{color:var(--rfb-color-on-surface-muted);font:400 14px/20px var(--rfb-font-sans);}",
  ".rfb-field{display:grid;gap:var(--rfb-space-field-gap);}",
  ".rfb-label{font:600 14px/20px var(--rfb-font-sans);letter-spacing:0;}",
  ".rfb-error{color:var(--rfb-color-danger);font:400 14px/20px var(--rfb-font-sans);}",
  ".rfb-field[data-rfb-invalid=\"true\"] .rfb-input{border-color:var(--rfb-color-danger);box-shadow:inset 3px 0 0 var(--rfb-color-danger);}",
  ".rfb-field[data-rfb-disabled=\"true\"]{opacity:.72;}",
  ".rfb-input{inline-size:100%;border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);color:var(--rfb-color-on-surface);font:400 14px/20px var(--rfb-font-sans);min-block-size:var(--rfb-component-input-height);padding:8px 10px;}",
  ".rfb-input[dir=\"ltr\"],.rfb-code,.rfb-artifact-code,[data-rfb-technical-value=\"true\"]{direction:ltr;text-align:left;font-family:var(--rfb-font-mono);}",
  ".rfb-fieldset{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);padding:var(--rfb-space-3);}",
  ".rfb-section,.rfb-step{display:grid;gap:var(--rfb-space-3);}",
  ".rfb-section-title,.rfb-step-title{font:650 20px/28px var(--rfb-font-sans);letter-spacing:0;margin:0;}",
  ".rfb-messages{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface-muted);padding:var(--rfb-space-3);}",
  ".rfb-messages[data-rfb-submission-status=\"validation_error\"],.rfb-messages[data-rfb-submission-status=\"conflict\"],.rfb-messages[data-rfb-submission-status=\"auth_error\"],.rfb-messages[data-rfb-submission-status=\"rate_limited\"],.rfb-messages[data-rfb-submission-status=\"server_error\"]{border-color:var(--rfb-color-danger-border);background:var(--rfb-color-danger-surface);color:var(--rfb-color-danger);}",
  ".rfb-navigation{display:flex;gap:var(--rfb-space-inline-gap);flex-wrap:wrap;}",
  ".rfb-button{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);color:var(--rfb-color-on-surface);font:600 14px/20px var(--rfb-font-sans);min-block-size:var(--rfb-component-button-height);padding:8px 12px;display:inline-flex;align-items:center;justify-content:center;gap:var(--rfb-space-inline-gap);cursor:pointer;}",
  ".rfb-submit-button{background:var(--rfb-color-primary);border-color:var(--rfb-color-primary);color:var(--rfb-color-on-primary);}",
  focusCss
].join("\n");

const builderThemeCss = [
  ".rfb-builder{background:var(--rfb-color-surface-muted);color:var(--rfb-color-on-surface);font-family:var(--rfb-font-sans);min-height:720px;overflow:hidden;}",
  ".rfb-builder[dir=\"rtl\"]{font-family:var(--rfb-font-rtl);}",
  ".rfb-builder *{box-sizing:border-box;}",
  ".rfb-command-bar{block-size:var(--rfb-component-builder-command-bar-height);background:var(--rfb-color-surface);border-block-end:1px solid var(--rfb-color-border);display:flex;align-items:center;justify-content:space-between;gap:var(--rfb-space-4);padding-inline:var(--rfb-space-4);}",
  ".rfb-command-title{min-inline-size:0;display:grid;gap:2px;}",
  ".rfb-command-title h1{font-size:16px;line-height:20px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
  ".rfb-command-title span,.rfb-help,.rfb-node-meta,.rfb-palette-copy span{color:var(--rfb-color-on-surface-muted);font-size:12px;line-height:16px;}",
  ".rfb-command-actions,.rfb-inline{display:flex;align-items:center;gap:var(--rfb-space-inline-gap);flex-wrap:wrap;}",
  ".rfb-command-actions{min-inline-size:max-content;}",
  ".rfb-command-diagnostics{display:flex;align-items:center;gap:var(--rfb-space-inline-gap);min-inline-size:0;overflow:auto;}",
  ".rfb-command-diagnostics span{font-size:12px;line-height:16px;color:var(--rfb-color-warning);white-space:nowrap;}",
  ".rfb-workflow-panels{background:var(--rfb-color-surface-muted);border-block-end:1px solid var(--rfb-color-border);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--rfb-space-3);padding:var(--rfb-space-3) var(--rfb-space-4);}",
  ".rfb-workflow-row,.rfb-stack{display:grid;gap:var(--rfb-space-3);min-inline-size:0;}",
  ".rfb-workflow-card{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);padding:var(--rfb-space-3);display:grid;gap:10px;min-inline-size:0;}",
  ".rfb-workflow-card summary{cursor:pointer;font-weight:800;}",
  ".rfb-workflow-card-header{display:flex;align-items:center;gap:var(--rfb-space-inline-gap);flex-wrap:wrap;}",
  ".rfb-check-list{display:grid;gap:var(--rfb-space-2);margin:0;padding:0;list-style:none;}",
  ".rfb-check-list li{border-inline-start:3px solid var(--rfb-color-info);padding-inline-start:var(--rfb-space-2);display:grid;gap:2px;min-inline-size:0;}",
  ".rfb-check-list li[data-severity=\"error\"]{border-color:var(--rfb-color-danger);}",
  ".rfb-check-list li[data-severity=\"warning\"]{border-color:var(--rfb-color-warning);}",
  ".rfb-check-list li span{color:var(--rfb-color-on-surface-muted);font-size:12px;line-height:16px;overflow-wrap:anywhere;}",
  ".rfb-artifact-grid{display:flex;gap:var(--rfb-space-inline-gap);flex-wrap:wrap;}",
  ".rfb-artifact-code{max-block-size:180px;overflow:auto;border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-sm);background:var(--rfb-color-surface-muted);padding:10px;font-size:12px;line-height:18px;}",
  ".rfb-builder-layout{display:grid;grid-template-columns:var(--rfb-component-builder-palette-width) minmax(320px,1fr) var(--rfb-component-builder-inspector-width);grid-template-areas:\"palette canvas inspector\";block-size:calc(100vh - var(--rfb-component-builder-command-bar-height));min-block-size:664px;}",
  "[dir=\"rtl\"] .rfb-builder-layout{grid-template-areas:\"palette canvas inspector\";}[dir=\"ltr\"] .rfb-builder-layout{grid-template-areas:\"inspector canvas palette\";}",
  ".rfb-palette{grid-area:palette;background:var(--rfb-color-surface);border-inline-start:1px solid var(--rfb-color-border);overflow:auto;padding:var(--rfb-space-panel-padding);}",
  ".rfb-inspector{grid-area:inspector;background:var(--rfb-color-surface);border-inline-end:1px solid var(--rfb-color-border);overflow:auto;}",
  ".rfb-canvas-region{grid-area:canvas;overflow:auto;padding:var(--rfb-space-6);}",
  ".rfb-canvas{inline-size:min(var(--rfb-component-builder-canvas-max-width),100%);margin-inline:auto;display:grid;gap:var(--rfb-space-canvas-gap);}",
  ".rfb-panel-title{font-size:14px;line-height:20px;font-weight:700;margin:0 0 12px;}",
  ".rfb-builder .rfb-button,.rfb-builder .rfb-icon-button{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);color:var(--rfb-color-on-surface);font:600 14px/20px var(--rfb-font-sans);min-block-size:38px;padding:8px 12px;display:inline-flex;align-items:center;justify-content:center;gap:var(--rfb-space-inline-gap);cursor:pointer;white-space:nowrap;}",
  ".rfb-builder .rfb-button[data-variant=\"primary\"]{background:var(--rfb-color-primary);border-color:var(--rfb-color-primary);color:var(--rfb-color-on-primary);}.rfb-builder .rfb-button[data-variant=\"accent\"]{background:var(--rfb-color-accent);border-color:var(--rfb-color-accent);color:var(--rfb-color-on-accent);}",
  ".rfb-builder .rfb-button:disabled,.rfb-builder .rfb-icon-button:disabled{cursor:not-allowed;opacity:.52;}.rfb-builder .rfb-icon-button{inline-size:var(--rfb-component-icon-button-size);padding:0;}",
  ".rfb-builder .rfb-input,.rfb-builder .rfb-textarea,.rfb-builder .rfb-select{inline-size:100%;border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);color:var(--rfb-color-on-surface);font:400 14px/20px var(--rfb-font-sans);padding:8px 10px;min-block-size:var(--rfb-component-input-height);}",
  ".rfb-builder .rfb-textarea{resize:vertical;min-block-size:76px;}.rfb-builder .rfb-input[dir=\"ltr\"],.rfb-builder .rfb-code{direction:ltr;text-align:left;font-family:var(--rfb-font-mono);}",
  ".rfb-builder .rfb-sr-only{position:absolute;inline-size:1px;block-size:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}",
  ".rfb-builder .rfb-empty,.rfb-builder .rfb-alert{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface-muted);padding:var(--rfb-space-6);color:var(--rfb-color-on-surface-muted);display:grid;gap:var(--rfb-space-2);}",
  ".rfb-builder .rfb-alert{padding:12px 14px;background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);}.rfb-builder .rfb-alert[data-severity=\"error\"]{background:var(--rfb-color-danger-surface);color:var(--rfb-color-danger);border-color:var(--rfb-color-danger-border);}.rfb-builder .rfb-alert[data-severity=\"warning\"]{background:var(--rfb-color-warning-surface);color:var(--rfb-color-warning);border-color:var(--rfb-color-warning-border);}.rfb-builder .rfb-alert[data-severity=\"success\"]{background:var(--rfb-color-success-surface);color:var(--rfb-color-success);border-color:var(--rfb-color-success-border);}",
  ".rfb-builder .rfb-badge{border-radius:var(--rfb-radius-pill);background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);font-size:12px;line-height:16px;font-weight:700;min-block-size:var(--rfb-component-badge-height);padding:4px 8px;display:inline-flex;align-items:center;max-inline-size:100%;}",
  ".rfb-palette-search{margin-block-end:var(--rfb-space-4);}.rfb-palette-group{display:grid;gap:var(--rfb-space-2);margin-block-end:18px;}.rfb-palette-group h3{font-size:12px;line-height:16px;margin:0;color:var(--rfb-color-on-surface-muted);text-transform:uppercase;}",
  ".rfb-palette-item{inline-size:100%;border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);padding:10px;text-align:start;display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:10px;align-items:start;}.rfb-palette-item:hover,.rfb-node:hover{border-color:var(--rfb-color-border-strong);box-shadow:var(--rfb-shadow-level-1);}.rfb-palette-icon{block-size:32px;inline-size:32px;border-radius:var(--rfb-radius-sm);background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);display:grid;place-items:center;font-weight:800;}.rfb-palette-copy{display:grid;gap:2px;min-inline-size:0;}.rfb-palette-copy strong,.rfb-node-label{overflow-wrap:anywhere;}",
  ".rfb-node{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);padding:14px;display:grid;gap:10px;cursor:pointer;}.rfb-node[data-dragging=\"true\"]{opacity:.56;box-shadow:var(--rfb-shadow-level-1);}.rfb-node[data-drop-active=\"true\"]{border-color:var(--rfb-color-primary);background:var(--rfb-color-primary-container);box-shadow:inset 3px 0 0 var(--rfb-color-primary);}.rfb-node[data-selected=\"true\"]{border-color:var(--rfb-color-primary);box-shadow:0 0 0 3px var(--rfb-color-primary-container);}",
  ".rfb-node-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:flex-start;gap:var(--rfb-space-3);}.rfb-node-title{display:grid;gap:3px;min-inline-size:0;}.rfb-node-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;}",
  ".rfb-drag-handle{border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-sm);background:var(--rfb-color-surface-muted);color:var(--rfb-color-on-surface-muted);font:800 14px/18px var(--rfb-font-sans);inline-size:32px;min-block-size:32px;display:grid;place-items:center;cursor:grab;touch-action:none;}.rfb-drag-handle[data-dragging=\"true\"]{cursor:grabbing;background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);border-color:var(--rfb-color-primary);}",
  ".rfb-drop-zone{border:1px dashed transparent;border-radius:var(--rfb-radius-sm);min-block-size:30px;display:grid;place-items:center;color:transparent;font-size:12px;line-height:16px;}.rfb-drop-zone[data-active=\"true\"]{border-color:var(--rfb-color-primary);background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);}.rfb-drop-zone span{pointer-events:none;}",
  ".rfb-drop-feedback{inline-size:min(var(--rfb-component-builder-canvas-max-width),100%);margin:0 auto 12px;border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);padding:10px 12px;color:var(--rfb-color-on-surface-muted);font-size:13px;line-height:18px;}.rfb-drop-feedback[data-status=\"valid\"]{border-color:var(--rfb-color-primary);background:var(--rfb-color-primary-container);color:var(--rfb-color-on-primary-container);}.rfb-drop-feedback[data-status=\"invalid\"]{border-color:var(--rfb-color-danger-border);background:var(--rfb-color-danger-surface);color:var(--rfb-color-danger);box-shadow:inset 3px 0 0 var(--rfb-color-danger);}",
  ".rfb-drag-overlay{border:1px solid var(--rfb-color-primary);border-radius:var(--rfb-radius-md);background:var(--rfb-color-surface);box-shadow:var(--rfb-shadow-level-2);padding:10px 12px;min-inline-size:180px;display:grid;gap:2px;}.rfb-drag-overlay span{font-weight:800;overflow-wrap:anywhere;}.rfb-drag-overlay small{color:var(--rfb-color-on-surface-muted);}",
  ".rfb-field-preview{border:1px dashed var(--rfb-color-border);border-radius:var(--rfb-radius-sm);padding:10px;color:var(--rfb-color-on-surface-muted);background:var(--rfb-color-surface-muted);}.rfb-inspector-header{padding:var(--rfb-space-4);border-block-end:1px solid var(--rfb-color-border);}.rfb-tabs{display:flex;gap:0;border-block-end:1px solid var(--rfb-color-border);overflow:auto;}.rfb-tab{border:0;border-inline-end:1px solid var(--rfb-color-border);background:var(--rfb-color-surface);padding:10px 12px;min-block-size:40px;font-weight:700;color:var(--rfb-color-on-surface-muted);cursor:pointer;white-space:nowrap;}.rfb-tab[aria-selected=\"true\"]{color:var(--rfb-color-primary);box-shadow:inset 0 -3px 0 var(--rfb-color-primary);}.rfb-inspector-body{padding:var(--rfb-space-4);display:grid;gap:var(--rfb-space-4);}.rfb-inspector-row{display:grid;gap:6px;}.rfb-inspector-row label,.rfb-label{font-size:14px;line-height:20px;font-weight:700;}",
  ".rfb-preview-frame{inline-size:min(var(--rfb-component-builder-canvas-max-width),100%);margin-inline:auto;background:var(--rfb-color-surface);border:1px solid var(--rfb-color-border);border-radius:var(--rfb-radius-md);padding:var(--rfb-space-6);}.rfb-builder .rfb-diagnostics{display:grid;gap:var(--rfb-space-2);}",
  ".rfb-workflow-card[data-can-publish=\"false\"]{border-color:var(--rfb-color-warning-border);box-shadow:inset 3px 0 0 var(--rfb-color-warning);}",
  "@media (max-width: 1024px){.rfb-workflow-panels{grid-template-columns:repeat(2,minmax(0,1fr));}.rfb-builder-layout{grid-template-columns:260px minmax(320px,1fr);grid-template-areas:\"palette canvas\";}.rfb-inspector{position:fixed;inset-block:var(--rfb-component-builder-command-bar-height) 0;inset-inline-start:0;inline-size:min(360px,88vw);z-index:10;box-shadow:var(--rfb-shadow-level-2);}.rfb-builder[data-active-panel=\"preview\"] .rfb-inspector{display:none;}}",
  "@media (max-width: 720px){.rfb-command-bar{block-size:auto;min-block-size:var(--rfb-component-builder-command-bar-height);align-items:flex-start;flex-direction:column;padding-block:var(--rfb-space-3);}.rfb-command-actions{inline-size:100%;overflow:auto;}.rfb-workflow-panels{grid-template-columns:1fr;padding:var(--rfb-space-3);}.rfb-builder-layout{display:flex;flex-direction:column;block-size:auto;min-block-size:0;}.rfb-palette{border-inline-start:0;border-block-end:1px solid var(--rfb-color-border);max-block-size:260px;}.rfb-canvas-region{padding:var(--rfb-space-4);}.rfb-inspector{position:static;inline-size:auto;box-shadow:none;border-inline-end:0;border-block-start:1px solid var(--rfb-color-border);}.rfb-preview-frame{padding:var(--rfb-space-4);}.rfb-builder{min-height:100vh;overflow:auto;}}",
  focusCss
].join("\n");

const reducedMotionCss = [
  "@media (prefers-reduced-motion: no-preference){.rfb-form .rfb-button,.rfb-form .rfb-input,.rfb-builder .rfb-button,.rfb-builder .rfb-icon-button,.rfb-builder .rfb-palette-item,.rfb-builder .rfb-node,.rfb-builder .rfb-tab,.rfb-builder .rfb-drop-zone,.rfb-builder .rfb-drag-handle{transition:border-color var(--rfb-motion-normal) var(--rfb-motion-easing),box-shadow var(--rfb-motion-normal) var(--rfb-motion-easing),background-color var(--rfb-motion-normal) var(--rfb-motion-easing),color var(--rfb-motion-normal) var(--rfb-motion-easing),opacity var(--rfb-motion-normal) var(--rfb-motion-easing);}}",
  "@media (prefers-reduced-motion: reduce){.rfb-form *,.rfb-builder *{transition-duration:0.01ms!important;animation-duration:0.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;}}"
].join("\n");
