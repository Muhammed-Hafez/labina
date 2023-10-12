import { UserConfig } from "next-i18next";

export default interface ITranslate {
  locale: string | undefined;
  _nextI18Next?:
    | {
        initialI18nStore: any;
        initialLocale: string;
        ns: string[];
        userConfig: UserConfig | null;
      }
    | undefined;
}
