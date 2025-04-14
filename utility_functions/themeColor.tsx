import { colorScheme } from "nativewind";

// Gets the color used for device components. E.g. Status bar and navigation bar colors
const getThemeMainColor = (colorScheme: string | undefined) => {
  return colorScheme == "dark" ? "#0f0f0f" : "#f5f5f5";
};

export default getThemeMainColor;

export const getThemeFontColor = (colorScheme: string | undefined) => {
  return colorScheme == "dark" ? "#f5f5f5" : "#0f0f0f";
};
