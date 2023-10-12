import type { ITitle } from "./interfaces/ITitle";

interface ICountry {
  _id?: string;
  active?: boolean;
}

export interface ICountryGet extends ICountry {
  isoCode: string;
  phoneCode: string;
  titleList: ITitle[];
}

export interface ICountryPost extends ICountry {
  isoCode: string;
  phoneCode: string;
  titleList: ITitle[];
}

export interface ICountryDTO extends ICountry {
  isoCode: string;
  phoneCode: string;
  titleList: ITitle[];
}

export interface ICountryForm extends ICountry {
  title?: string;
  isoCode?: string;
  phoneCode?: string;
}

export class CountryForm implements ICountryForm {
  _id?: string;
  active?: boolean;
  isoCode?: string;
  phoneCode?: string;
  title?: string;

  constructor({
    _id,
    active = true,
    isoCode = "",
    phoneCode = "",
    title = "",
  }: ICountryForm = {}) {
    this._id = _id;
    this.active = active;
    this.isoCode = isoCode;
    this.phoneCode = phoneCode;
    this.title = title;
  }
}
