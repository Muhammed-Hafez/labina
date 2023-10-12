// import type { gender } from "./types";
import type { ITitle } from "./interfaces/ITitle";
import type { IPromotionDTO } from "./Promotion";

interface ICategory {
  _id?: string;
  active?: boolean;
  showInHomepageTop?: boolean;
  showInHomepageBottom?: boolean;
  showInHeader?: boolean;
  showInSidebar?: boolean;
  showInFooter?: boolean;
  isNewCategory?: boolean;
  isFeaturedCategory?: boolean;
  icon?: string;
  keywordList?: string[];
  image?: string;
}

export interface ICategoryGet extends ICategory {
  _id: string;
  slug: string;
  // gender: gender;
  titleList: ITitle[];
  descriptionList?: ITitle[];
  level: number;
  parent?: ICategoryGet;
  // promotion?: IPromotionGet;
  // promotionList?: IPromotionGet[];
  childList?: ICategoryGet[];
}

export interface ICategoryPost extends ICategory {
  slug?: string;
  // gender?: gender;
  titleList: ITitle[];
  descriptionList?: ITitle[];
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];
  parent?: string;
}

export interface ICategoryDTO extends ICategory {
  slug: string;
  // gender: gender;
  titleList: ITitle[];
  descriptionList?: ITitle[];
  // promotion?: string | IPromotionDTO;
  // promotionList?: string[] | IPromotionDTO[];
  couponList?: string[] | IPromotionDTO[];
  level?: number;
  parent?: string | ICategoryDTO;
}

export interface ICategoryForm extends ICategory {
  _id?: string;
  slug?: string;
  // gender?: gender;
  parent?: string;
  title?: string;
  description?: string;
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];
}

export class CategoryForm implements ICategoryForm {
  _id?: string;
  slug?: string;
  // gender?: gender;
  parent?: string;
  active?: boolean;
  isNewCategory?: boolean;
  isFeaturedCategory?: boolean;
  showInHeader?: boolean;
  showInHomepageTop?: boolean;
  showInHomepageBottom?: boolean;
  showInSidebar?: boolean;
  showInFooter?: boolean;
  icon?: string;
  title?: string;
  description?: string;
  image?: string;
  keywordList?: string[];
  // promotion?: string;
  // promotionList?: string[];
  couponList?: string[];

  constructor({
    _id,
    active = true,
    couponList = [],
    description = "",
    icon = "",
    image = "",
    isFeaturedCategory = false,
    isNewCategory = false,
    keywordList = [],
    parent = "",
    showInFooter = false,
    showInHeader = false,
    showInHomepageBottom = false,
    showInHomepageTop = false,
    showInSidebar = false,
    slug = "",
    title = "",
  }: ICategoryForm = {}) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.slug = slug;
    // this.gender = gender;
    this.active = active;
    this.isNewCategory = isNewCategory;
    this.isFeaturedCategory = isFeaturedCategory;
    this.icon = icon;
    this.parent = parent;
    this.showInHomepageTop = showInHomepageTop;
    this.showInHomepageBottom = showInHomepageBottom;
    this.showInFooter = showInFooter;
    this.showInSidebar = showInSidebar;
    this.showInHeader = showInHeader;
    this.image = image;
    this.keywordList = keywordList;
    // this.promotion = promotion;
    // this.promotionList = promotionList;
    this.couponList = couponList;
  }
}
