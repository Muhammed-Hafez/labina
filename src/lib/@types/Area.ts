import type { ICityDTO, ICityGet } from "./City";
import type { ICountryDTO, ICountryGet } from "./Country";
import type { ITitle } from "./interfaces/ITitle";

interface IArea {
  _id?: string;
  active?: boolean;
}

export interface IAreaGet extends IArea {
  country: ICountryGet;
  // city: ICityGet;
  city: ICityGet;
  shippingPrice: number;
  titleList: ITitle[];
}

export interface IAreaPost extends IArea {
  country: string;
  // city: string;
  city: string;
  shippingPrice: number;
  titleList: ITitle[];
}

export interface IAreaDTO extends IArea {
  country: string | ICountryDTO;
  // city: string | ICityDTO;
  city: string | ICityDTO;
  shippingPrice: number;
  titleList: ITitle[];
}

export interface IAreaForm extends IArea {
  title?: string;
  country?: string;
  // city?: string;
  city?: string;
  shippingPrice?: number;
}

export class AreaForm implements IAreaForm {
  _id?: string;
  active?: boolean;
  title?: string;
  country?: string;
  // city?: string;
  city?: string;
  shippingPrice?: number;

  constructor({
    _id,
    active = true,
    city = "",
    country = "",
    shippingPrice,
    title = "",
  }: IAreaForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.country = country;
    // this.city = city;
    this.city = city;
    this.shippingPrice = shippingPrice;
  }
}
