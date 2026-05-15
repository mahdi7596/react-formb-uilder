import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  createBuilderThemeStyles,
  createDefaultThemeStyles,
  createFocusThemeStyles,
  createReducedMotionStyles,
  createRendererThemeStyles,
  createThemeVariables,
  defaultThemeTokens,
  defaultThemeVariableEntries,
  packageBoundary
} from "./index.js";

describe("@your-org/forms-themes contracts", () => {
  it("documents the themes package boundary", () => {
    expect(packageBoundary).toEqual({
      name: "@your-org/forms-themes",
      responsibility: "optional starter tokens and removable theme assets",
      phase: "theme-design-system-readiness"
    });
  });

  it("matches key DESIGN.md token decisions", () => {
    expect(defaultThemeTokens.colors.primary).toBe("#315CFF");
    expect(defaultThemeTokens.colors.accent).toBe("#087568");
    expect(defaultThemeTokens.colors.surfaceMuted).toBe("#F6F7FB");
    expect(defaultThemeTokens.colors.danger).toBe("#B42318");
    expect(defaultThemeTokens.typography.fontSans).toContain("Inter");
    expect(defaultThemeTokens.typography.fontRtl).toContain("Vazirmatn");
    expect(defaultThemeTokens.typography.h1.letterSpacing).toBe("0px");
    expect(defaultThemeTokens.spacing.panelPadding).toBe("16px");
    expect(defaultThemeTokens.radii.md).toBe("8px");
    expect(defaultThemeTokens.components.builderPaletteWidth).toBe("280px");
  });

  it("generates deterministic product-prefixed CSS variables", () => {
    const first = createThemeVariables();
    const second = createThemeVariables();

    expect(first).toBe(second);
    expect(first).toContain("--rfb-color-primary:#315CFF;");
    expect(first).toContain("--rfb-font-sans:");
    expect(first).toContain("--rfb-space-panel-padding:16px;");
    expect(first).toContain("--rfb-radius-md:8px;");
    expect(first).toContain("--rfb-motion-normal:160ms;");
    expect(first).toContain("--fb-primary:var(--rfb-color-primary);");
    expect(defaultThemeVariableEntries.every(([name]) => name.startsWith("--rfb-"))).toBe(true);
  });

  it("exports renderer, builder, combined, focus, and reduced-motion CSS helpers", () => {
    const renderer = createRendererThemeStyles();
    const builder = createBuilderThemeStyles();
    const combined = createDefaultThemeStyles();
    const focus = createFocusThemeStyles();
    const reducedMotion = createReducedMotionStyles();

    expect(renderer).toContain(".rfb-form");
    expect(renderer).toContain("[data-rfb-submission-status=\"validation_error\"]");
    expect(builder).toContain(".rfb-builder");
    expect(builder).toContain(".rfb-workflow-card[data-can-publish=\"false\"]");
    expect(combined).toContain(".rfb-form");
    expect(combined).toContain(".rfb-builder");
    expect(focus).toContain(":focus-visible");
    expect(reducedMotion).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps core independent from themes, CSS, React, and design system libraries", () => {
    const corePackageJson = JSON.parse(
      readFileSync(new URL("../../core/package.json", import.meta.url), "utf8")
    ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const deps = {
      ...corePackageJson.dependencies,
      ...corePackageJson.devDependencies
    };

    expect(deps["@your-org/forms-themes"]).toBeUndefined();
    expect(deps.react).toBeUndefined();
    expect(deps["@emotion/react"]).toBeUndefined();
    expect(deps.tailwindcss).toBeUndefined();
    expect(deps["@radix-ui/react-slot"]).toBeUndefined();
  });
});
