// import type { gender } from "./types";
import type { ICategoryDTO, ICategoryGet } from "./Category";
import type { ICouponDTO } from "./Coupon";
import type { ITitle } from "./interfaces/ITitle";
import type { ISizeDTO, ISizeGet } from "./Size";

interface IProduct {
  _id?: string;
  active?: boolean;
  isNewProduct?: boolean;
  isFeaturedProduct?: boolean;
  available?: boolean;
  // priceEachSize?: boolean;
  width?: number;
  length?: number;
  height?: number;
  promotionPrice?: number;
  couponPrice?: number;
  // mainCurrencyId: string;
  sellingCounter?: number;
  keywordList?: string[];
  mainImage?: string;
  imageList?: string[];
  showNewInHome?: boolean;
  showFeaturedInHome?: boolean;
}

export interface IProductGet extends IProduct {
  _id: string;
  sellingCounter: number;
  quantity: number;
  sku: string;
  slug: string;
  // gender: // gender;
  mainPrice: number;
  // mainCurrency: ICurrencyGet;
  // sizeList?: { size: ISizeGet; price?: number }[];
  // brand?: IBrandGet;
  // color?: IColorGet;
  // material?: IMaterialGet;
  size?: ISizeGet;
  // colorAltList?: IProductGet[];
  // materialAltList?: IProductGet[];
  sizeAltList?: IProductGet[];
  relatedList?: IProductGet[];
  category: ICategoryGet;
  // promotion?: IPromotionGet;
  // promotionList?: IPromotionGet[];
  titleList: ITitle[];
  descriptionList: ITitle[];
}

export interface IProductPost extends IProduct {
  // mainCurrency: string;
  quantity?: number;
  sku?: string;
  slug?: string;
  // gender?: // gender;
  mainPrice?: number;
  // brand?: string;
  // color?: string;
  // material?: string;
  size?: string;
  // colorAltList?: string[];
  // materialAltList?: string[];
  sizeAltList?: string[];
  // sizeList?: { size: string; price?: number }[];
  relatedList?: string[];
  category?: string;
  titleList: ITitle[];
  descriptionList: ITitle[];
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];
}

export interface IProductDTO extends IProduct {
  // mainCurrency: string | ICurrencyDTO;
  quantity: number;
  sku: string;
  slug: string;
  // gender: // gender;
  mainPrice: number;
  // brand?: string | IBrandDTO;
  // color?: string | IColorDTO;
  // material?: string | IMaterialDTO;
  size?: string | ISizeDTO;
  // colorAltList?: string[] | IColorDTO[];
  // materialAltList?: string[] | IMaterialDTO[];
  sizeAltList?: string[] | ISizeDTO[];
  // sizeList?: { size: ISizeDTO | string; price?: number }[];
  relatedList?: string[] | IProductDTO[];
  category: string | ICategoryDTO;
  titleList: ITitle[];
  descriptionList: ITitle[];
  // promotion?: string | IPromotionDTO;
  // promotionList?: string[] | IPromotionDTO[];
  couponList?: string[] | ICouponDTO[];
}

export interface IProductForm extends IProduct {
  quantity?: number;
  sku?: string;
  slug?: string;
  // brand?: string;
  // color?: string;
  // material?: string;
  // size?: string;
  // colorAltList?: string[];
  // materialAltList?: string[];
  // sizeAltList?: string[];
  mainPrice?: number;
  // gender?: // gender;
  // sizeList?: { size: string; price?: number }[];
  relatedList?: string[];
  category?: string;
  title?: string;
  description?: string;
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];
}

export class ProductForm implements IProductForm {
  _id?: string;
  active?: boolean;
  isNewProduct?: boolean;
  isFeaturedProduct?: boolean;
  available?: boolean;
  // brand?: string;
  // color?: string;
  // material?: string;
  // size?: string;
  // colorAltList?: string[];
  // materialAltList?: string[];
  // sizeAltList?: string[];
  // priceEachSize?: boolean;
  // sizeList?: { size: string; price?: number }[];
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];
  width?: number;
  length?: number;
  height?: number;
  mainPrice?: number;
  keywordList?: string[];
  mainImage?: string;
  imageList?: string[];
  quantity?: number;
  sku?: string;
  slug?: string;
  // gender?: // gender;
  relatedList?: string[];
  category?: string;
  title?: string;
  description?: string;
  showNewInHome?: boolean;
  showFeaturedInHome?: boolean;

  constructor({
    _id,
    active = true,
    available = true,
    category = "",
    couponList = [],
    // couponPrice,
    description = "",
    height,
    imageList = [],
    isFeaturedProduct = false,
    isNewProduct = false,
    keywordList = [],
    length,
    mainImage = "",
    mainPrice,
    // promotionPrice,
    quantity = 1,
    relatedList = [],
    // sellingCounter,
    showFeaturedInHome = false,
    showNewInHome = false,
    // size ,
    // sizeAltList,
    sku = "",
    slug = "",
    title = "",
    width,
  }: IProductForm = {}) {
    this._id = _id;
    this.isNewProduct = isNewProduct;
    this.isFeaturedProduct = isFeaturedProduct;
    this.active = active;
    this.available = available;
    this.quantity = quantity;
    this.sku = sku;
    this.slug = slug;
    // this.gender = gender;
    this.slug = slug;
    // this.brand = brand;
    // this.color = color;
    // this.material = material;
    // this.size = size;
    // this.priceEachSize = priceEachSize;
    this.mainPrice = mainPrice;
    this.title = title;
    this.description = description;
    this.mainImage = mainImage;
    this.width = width;
    this.length = length;
    this.height = height;
    this.category = category;
    // this.colorAltList = colorAltList;
    // this.materialAltList = materialAltList;
    // this.sizeAltList = sizeAltList;
    // this.sizeList = sizeList;
    // this.promotion = promotion;
    // this.promotionList = promotionList;
    this.couponList = couponList;
    this.relatedList = relatedList;
    this.imageList = imageList;
    this.keywordList = keywordList;
    this.showNewInHome = showNewInHome;
    this.showFeaturedInHome = showFeaturedInHome;
  }
}
