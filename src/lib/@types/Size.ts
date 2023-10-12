import type { ITitle } from "./interfaces/ITitle";

interface ISize {
  _id?: string;
  active?: boolean;
}

export interface ISizeGet extends ISize {
  _id: string;
  titleList: ITitle[];
  code: string;
}

export interface ISizePost extends ISize {
  titleList: ITitle[];
  code: string;
}

export interface ISizeDTO extends ISize {
  titleList: ITitle[];
  code: string;
}

export interface ISizeForm extends ISize {
  title?: string;
  code?: string;
}

export class SizeForm implements ISizeForm {
  _id?: string;
  active?: boolean;
  title?: string;
  code?: string;

  constructor(size?: ISizeForm) {
    this._id = size?._id;
    this.active = size?.active;
    this.title = size?.title;
    this.code = size?.code;
  }
}
