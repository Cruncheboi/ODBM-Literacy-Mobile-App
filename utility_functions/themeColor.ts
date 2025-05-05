import { colorScheme } from "nativewind";

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The color to use for device components. E.g. Status bar and navigation bar colors
 */
const getThemeMainColor = (colorScheme: string | undefined) => {
  return colorScheme == "dark" ? "#0f0f0f" : "#f5f5f5";
};

export default getThemeMainColor;

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The font color to use that contrasts the current theme.
 */
export const getThemeFontColor = (colorScheme: string | undefined) => {
  return colorScheme == "dark" ? "#f5f5f5" : "#0f0f0f";
};

/**
 *
 * @param colorScheme Current color scheme in use.
 * @returns The secondary color to use for device components. E.g. Status bar and navigation bar colors
 */
export const getThemeSecondaryColor = (colorScheme: string | undefined) => {
  return colorScheme == "dark" ? "#222222" : "#f5f5f5";
};
