import type { ITitle } from "./interfaces/ITitle";
export interface ILanguage {
  _id?: string;
  title?: string;
  code?: string;
  active?: boolean;
}

export interface ILanguageDTO {
  _id?: string;
  title: string;
  code: string;
  active: boolean;
  default: boolean;
}

export interface ILanguageGet extends ILanguage {
  titleList: ITitle[];
  code: string;
}

export class LanguageForm implements ILanguage {
  _id?: string;
  title?: string;
  code?: string;
  active?: boolean;

  constructor({ _id, active = true, code = "", title = "" }: ILanguage = {}) {
    this._id = _id;
    this.title = title;
    this.code = code;
    this.active = active;
  }
}
