import type { ICurrencyDTO, ICurrencyGet } from "../Currency";

interface IPrice {
  price: number;
}

export interface IPriceGet extends IPrice {
  currency: ICurrencyGet;
}

export interface IPricePost extends IPrice {
  currency: string;
}

export interface IPriceDTO extends IPrice {
  currency: string | ICurrencyDTO;
}
