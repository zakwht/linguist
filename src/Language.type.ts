export type LanguageType = "programming" | "data" | "markup" | "prose";

export type Language = {
  name: string;
  aliases?: string[];
  type: LanguageType;
  ace_mode: string;
  color?: string;
  extensions?: string[];
  filenames?: string[];
  group?: string;
};
