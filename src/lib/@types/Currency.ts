import type { ITitle } from "./interfaces/ITitle";

interface ICurrency {
  _id?: string;
  code?: string;
  symbol?: string;
  active?: boolean;
}

export interface ICurrencyGet extends ICurrency {
  titleList: ITitle[];
  code: string;
}

export interface ICurrencyPost extends ICurrency {
  titleList: ITitle[];
  code: string;
}

export interface ICurrencyDTO extends ICurrency {
  titleList: ITitle[];
  code: string;
}

export interface ICurrencyForm extends ICurrency {
  code?: string;
  title?: string;
}

export class CurrencyForm implements ICurrencyForm {
  _id?: string;
  code?: string;
  symbol?: string;
  active?: boolean;
  title?: string;

  constructor({ _id, active, code, symbol, title }: ICurrencyForm = {}) {
    this._id = _id;
    this.code = code;
    this.symbol = symbol;
    this.active = active;
    this.title = title;
  }
}
