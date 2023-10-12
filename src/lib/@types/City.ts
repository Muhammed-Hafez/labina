import type { ICountryDTO, ICountryGet } from "./Country";
import type { ITitle } from "./interfaces/ITitle";

interface ICity {
  _id?: string;
  active?: boolean;
}

export interface ICityGet extends ICity {
  country: ICountryGet;
  titleList: ITitle[];
  // shippingPrice: number;
}

export interface ICityPost extends ICity {
  country: string;
  titleList: ITitle[];
  // shippingPrice: number;
}

export interface ICityDTO extends ICity {
  country: string | ICountryDTO;
  titleList: ITitle[];
  // shippingPrice: number;
}

export interface ICityForm extends ICity {
  title?: string;
  country?: string;
  // shippingPrice?: number;
}

export class CityForm implements ICityForm {
  _id?: string;
  active?: boolean;
  title?: string;
  country?: string;
  // shippingPrice?: number;

  constructor({
    _id,
    active = true,
    country = "",
    title = "",
  }: ICityForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.country = country;
    // this.shippingPrice = shippingPrice;
  }
}
