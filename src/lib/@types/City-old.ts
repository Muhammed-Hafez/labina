// import type { ICountryDTO, ICountryGet } from "./Country";
// import type { ICityDTO, ICityGet } from "./City";
// import type { ITitle } from "./interfaces/ITitle";

// interface ICity {
//   _id?: string;
//   active?: boolean;
// }

// export interface ICityGet extends ICity {
//   country: ICountryGet;
//   city: ICityGet;
//   titleList: ITitle[];
//   shippingPrice: number;
// }

// export interface ICityPost extends ICity {
//   country?: string;
//   city: string;
//   titleList: ITitle[];
//   shippingPrice: number;
// }

// export interface ICityDTO extends ICity {
//   country: string | ICountryDTO;
//   city: string | ICityDTO;
//   titleList: ITitle[];
//   shippingPrice: number;
// }

// export interface ICityForm extends ICity {
//   title?: string;
//   country?: string;
//   city?: string;
//   shippingPrice?: number;
// }

// export class CityForm implements ICityForm {
//   _id?: string;
//   active?: boolean;
//   title?: string;
//   city?: string;
//   shippingPrice?: number;

//   constructor(
//     city: ICityForm | undefined = {
//       _id: "",
//       active: true,
//       title: "",
//       city: "",
//       shippingPrice: 0,
//     }
//   ) {
//     this._id = city?._id;
//     this.active = city?.active;
//     this.title = city?.title;
//     this.city = city?.city;
//     this.shippingPrice = city?.shippingPrice;
//   }
// }
export {};
