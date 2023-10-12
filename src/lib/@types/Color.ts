import type { ITitle } from "./interfaces/ITitle";

interface IColor {
  _id?: string;
  active?: boolean;
}

export interface IColorGet extends IColor {
  titleList: ITitle[];
  code: string;
}

export interface IColorPost extends IColor {
  titleList: ITitle[];
  code: string;
}

export interface IColorDTO extends IColor {
  titleList: ITitle[];
  code: string;
}

export interface IColorForm extends IColor {
  title?: string;
  code?: string;
}

export class ColorForm implements IColorForm {
  _id?: string;
  code?: string;
  active?: boolean;
  title?: string;

  constructor({ _id, active = true, code = "", title = "" }: IColorForm = {}) {
    this._id = _id;
    this.code = code;
    this.active = active;
    this.title = title;
  }
}
