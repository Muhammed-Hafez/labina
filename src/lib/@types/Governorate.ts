import type { ICountryDTO, ICountryGet } from "./Country";
import type { ITitle } from "./interfaces/ITitle";

interface IGovernorate {
  _id?: string;
  active?: boolean;
}

export interface IGovernorateGet extends IGovernorate {
  country: ICountryGet;
  titleList: ITitle[];

  shippingPrice: number;
}

export interface IGovernoratePost extends IGovernorate {
  country: string;
  titleList: ITitle[];

  shippingPrice: number;
}

export interface IGovernorateDTO extends IGovernorate {
  country: string | ICountryDTO;
  titleList: ITitle[];

  shippingPrice: number;
}

export interface IGovernorateForm extends IGovernorate {
  title?: string;
  country?: string;

  shippingPrice?: number;
}

export class GovernorateForm implements IGovernorateForm {
  _id?: string;
  active?: boolean;
  title?: string;
  country?: string;
  shippingPrice?: number;

  constructor({
    _id,
    active,
    country,
    shippingPrice,
    title,
  }: IGovernorateForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.country = country;
    this.shippingPrice = shippingPrice;
  }
}
