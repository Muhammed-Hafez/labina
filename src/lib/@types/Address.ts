import type { IAreaDTO, IAreaGet } from "./Area";
import type { ICityDTO, ICityGet } from "./City";
import type { ICountryDTO, ICountryGet } from "./Country";

interface IAddress {
  _id?: string;
  active?: boolean;
  streetName?: string;
  buildingNumber?: string;
  floorNumber?: string;
  landMark?: string;
  phoneNumber?: string;
}

export interface IAddressGet extends IAddress {
  _id: string;
  country: ICountryGet;
  city: ICityGet;
  area: IAreaGet;
  streetName: string;
  buildingNumber: string;
  floorNumber: string;
  landMark?: string;
  phoneNumber: string;
}

export interface IAddressPost extends IAddress {
  country?: string;
  city?: string;
  area?: string;
}

export interface IAddressDTO extends IAddress {
  country: string | ICountryDTO;
  city: string | ICityDTO;
  area?: string | IAreaDTO;
}

export class AddressForm implements IAddressPost {
  _id?: string;
  active?: boolean;
  country?: string;
  city?: string;
  area?: string;
  streetName?: string;
  buildingNumber?: string;
  floorNumber?: string;
  landMark?: string;
  phoneNumber?: string;

  constructor({
    _id,
    active = true,
    area = "",
    buildingNumber = "",
    city = "",
    country = "",
    floorNumber = "",
    landMark = "",
    phoneNumber = "",
    streetName = "",
  }: IAddressPost = {}) {
    this._id = _id;
    this.active = active;
    this.area = area;
    this.city = city;
    this.country = country;
    this.streetName = streetName;
    this.buildingNumber = buildingNumber;
    this.floorNumber = floorNumber;
    this.landMark = landMark;
    this.phoneNumber = phoneNumber;
  }
}
