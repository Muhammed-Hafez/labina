import type { IProductDTO, IProductPost } from "./Product";

interface ICart {
  _id?: string;
  quantity: number;
}

export interface ICartGet extends ICart {
  product: IProductPost;
}

export interface ICartPost extends ICart {
  product: string;
}

export interface ICartDTO extends ICart {
  product: IProductDTO | string;
}

// export interface ICartForm extends ICart {
//   title?: string;
//   code?: string;
// }

// export class CartForm implements ICartForm {
//   _id?: string;
//   active?: boolean;
//   title?: string;
//   code?: string;

//   constructor(
//     cart: ICartForm | undefined = {
//       _id: "",
//       active: true,
//       title: "",
//       code: "",
//     }
//   ) {
//     this._id = cart?._id;
//     this.active = cart?.active;
//     this.title = cart?.title;
//     this.code = cart?.code;
//   }
// }
