import type { ICategoryDTO, ICategoryGet } from "./Category";
import type { IProductDTO, IProductGet } from "./Product";

type promoType = "all" | "category" | "product" | "";

interface IPromotion {
  _id?: string;
  code?: string;
  value?: number;
  maxDiscountValue?: number;
  // minCartValue?: number;
  // isPercentage?: boolean;
  start?: Date;
  end?: Date;
  active?: boolean;
  type?: promoType;
}

export interface IPromotionGet extends IPromotion {
  _id: string;
  categoryList?: ICategoryGet[];
  productList?: IProductGet[];
}

export interface IPromotionPost extends IPromotion {
  categoryList?: string[];
  productList?: string[];
}

export interface IPromotionDTO extends IPromotion {
  categoryList?: string[] | ICategoryDTO[];
  productList?: string[] | IProductDTO[];
}

export interface IPromotionForm extends IPromotion {
  categoryList?: string[];
  productList?: string[];
}

export class PromotionForm implements IPromotionForm {
  _id?: string;
  code?: string;
  value?: number;
  maxDiscountValue?: number;
  // minCartValue?: number;
  // isPercentage?: boolean;
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
    end,
    maxDiscountValue,
    productList = [],
    start,
    type = "",
    value,
  }: PromotionForm = {}) {
    this._id = _id;
    this.code = code;
    this.value = value;
    this.maxDiscountValue = maxDiscountValue;
    // this.minCartValue = minCartValue;
    // this.isPercentage = isPercentage;
    this.start = start;
    this.end = end;
    this.active = active;
    this.type = type;
    this.categoryList = categoryList;
    this.productList = productList;
  }
}
