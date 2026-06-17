import { colorScheme } from "nativewind";
type ColorScheme = ReturnType<typeof colorScheme.get>;

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The color to use for device components. E.g. Status bar and navigation bar colors
 */
const getThemeMainColor = (colorScheme: ColorScheme) => {
  return colorScheme == "dark" ? "#0f0f0f" : "#f5f5f5";
};

export default getThemeMainColor;

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The font color to use that contrasts the current theme.
 */
export const getThemeFontColor = (colorScheme: ColorScheme) => {
  return colorScheme == "dark" ? "#f5f5f5" : "#173A64";
};

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The secondary color to use for device components. E.g. Status bar and navigation bar colors
 */
export const getThemeSecondaryColor = (colorScheme: ColorScheme) => {
  return colorScheme == "dark" ? "#222222" : "#f5f5f5";
};

export const getPrimaryColor = () => {
  return "#FAB432";
};

export const getAccentColor = (colorScheme: ColorScheme) => {
  return colorScheme == "dark" ? "#173A64" : "#D5E2E9";
};

export const getThemeHighlightColor = (colorScheme: ColorScheme) =>
  colorScheme == "dark" ? "#FAB432" : "#6DACDE";
