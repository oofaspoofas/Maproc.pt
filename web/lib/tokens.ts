export const tokens = {
  navy: "#003686",
  orange: "#ff6700",
  orangeInk: "#bc4200",
  surfaceDark: "#0a1628",
  surfaceLight: "#f5f6f7",
  textOnDark: "#f6f7f9",
  textMutedOnDark: "#aeb9c9",
} as const;

export function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
