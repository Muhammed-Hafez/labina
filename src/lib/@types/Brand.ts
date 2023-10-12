import type { ITitle } from "./interfaces/ITitle";

interface IBrand {
  _id?: string;
  active?: boolean;
}

export interface IBrandGet extends IBrand {
  titleList: ITitle[];
  code: string;
}

export interface IBrandPost extends IBrand {
  titleList: ITitle[];
  code: string;
}

export interface IBrandDTO extends IBrand {
  titleList: ITitle[];
  code: string;
}

export interface IBrandForm extends IBrand {
  title?: string;
  code?: string;
}

export class BrandForm implements IBrandForm {
  _id?: string;
  active?: boolean;
  title?: string;
  code?: string;

  constructor({ _id, active = true, code = "", title = "" }: IBrandForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.code = code;
  }
}
