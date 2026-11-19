interface Dimensions {
  width: number;
  height: number;
}

/**
 * Converts bytes into a string displaying MB if greater than 1 MB, otherwise KB.
 * @param bytes The number of bytes.
 * @param decimals Places to display past the decimal point.
 * @returns A string that displays the byte size in MB or KB.
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes <= 0) return "0 KB";

  const k = 1024;
  const mb = k * k;

  if (bytes >= mb) {
    return `${(bytes / mb).toFixed(decimals)} MB`;
  }

  return `${(bytes / k).toFixed(decimals)} KB`;
};

export const getContainedDimensions = (
  container: Dimensions,
  image: Dimensions,
): Dimensions => {
  const widthRatio = container.width / image.width;
  const heightRatio = container.height / image.height;
  const scale = Math.min(widthRatio, heightRatio);

  return {
    width: image.width * scale,
    height: image.height * scale,
  };
};
