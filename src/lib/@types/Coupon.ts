import type { ICategoryDTO, ICategoryGet } from "./Category";
import type { IProductDTO, IProductGet } from "./Product";

type promoType = "all" | "category" | "product" | "";

interface ICoupon {
  _id?: string;
  code?: string;
  value?: number;
  maxDiscountValue?: number;
  minCartValue?: number;
  isPercentage?: boolean;
  start?: Date;
  end?: Date;
  active?: boolean;
  type?: promoType;
}

export interface ICouponGet extends ICoupon {
  _id: string;
  categoryList?: ICategoryGet[];
  productList?: IProductGet[];
}

export interface ICouponPost extends ICoupon {
  categoryList?: string[];
  productList?: string[];
}

export interface ICouponDTO extends ICoupon {
  categoryList?: string[] | ICategoryDTO[];
  productList?: string[] | IProductDTO[];
}

export interface ICouponForm extends ICoupon {
  categoryList?: string[];
  productList?: string[];
}

export class CouponForm implements ICouponForm {
  _id?: string;
  code?: string;
  value?: number;
  maxDiscountValue?: number;
  minCartValue?: number;
  isPercentage?: boolean;
  start?: Date;
  end?: Date;
  active?: boolean;
  type?: promoType;
  categoryList?: string[];
  productList?: string[];

  constructor({
    _id,
    active = true,
    categoryList = [],
    code = "",
    value,
    isPercentage = true,
    maxDiscountValue,
    minCartValue,
    productList = [],
    start,
    end,
    type,
  }: CouponForm = {}) {
    this._id = _id;
    this.code = code;
    this.value = value;
    this.maxDiscountValue = maxDiscountValue;
    this.minCartValue = minCartValue;
    this.isPercentage = isPercentage;
    this.start = start;
    this.end = end;
    this.active = active;
    this.type = type;
    this.categoryList = categoryList;
    this.productList = productList;
  }
}
