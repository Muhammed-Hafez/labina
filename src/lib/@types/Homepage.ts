import type { ITitle } from "./interfaces/ITitle";

interface IHomepage {
  _id?: string;
  titleList?: ITitle[];
  logo?: string;
  active?: boolean;
  // default?: boolean;
  isHeroCarousel?: boolean;
  heroCarouselImageList?: string[];
  isCategorySection?: boolean;
  categorySectionSlugList?: string[];
  isBannerOne?: boolean;
  bannerOneImage?: string;
  isFeaturedProductSection?: boolean;
  isBannerTwo?: boolean;
  bannerTwoImage?: string;
  isNewProductSection?: boolean;
  isTopSellingProductSection?: boolean;
  isRecipeSection?: boolean;
  isAdvertisementSection?: boolean;
  advertisementSectionImageList?: string[];
}

export interface IHomepageGet extends IHomepage {
  _id: string;
  titleList: ITitle[];
  logo: string;
  active: boolean;
  // default?: boolean;
  isHeroCarousel: boolean;
  heroCarouselImageList: string[];
  isCategorySection: boolean;
  categorySectionSlugList: string[];
  isBannerOne: boolean;
  bannerOneImage: string;
  isFeaturedProductSection: boolean;
  isBannerTwo: boolean;
  bannerTwoImage: string;
  isNewProductSection: boolean;
  isTopSellingProductSection: boolean;
  isRecipeSection: boolean;
  isAdvertisementSection: boolean;
  advertisementSectionImageList: string[];
}

export interface IHomepagePost extends IHomepage {}

export interface IHomepageDTO extends IHomepage {}

export interface IHomepageForm extends IHomepage {
  title?: string;
}

export class HomepageForm implements IHomepageForm {
  _id?: string;
  title?: string;
  titleList?: ITitle[];
  logo?: string;
  active?: boolean;
  // default?: boolean;
  isHeroCarousel?: boolean;
  heroCarouselImageList?: string[];
  isCategorySection?: boolean;
  categorySectionSlugList?: string[];
  isBannerOne?: boolean;
  bannerOneImage?: string;
  isFeaturedProductSection?: boolean;
  isBannerTwo?: boolean;
  bannerTwoImage?: string;
  isNewProductSection?: boolean;
  isTopSellingProductSection?: boolean;
  isRecipeSection?: boolean;
  isAdvertisementSection?: boolean;
  advertisementSectionImageList?: string[];

  constructor({
    _id,
    title = "",
    active = true,
    advertisementSectionImageList = [],
    bannerOneImage = "",
    bannerTwoImage = "",
    categorySectionSlugList = [],
    heroCarouselImageList = [],
    isAdvertisementSection,
    isBannerOne = true,
    isBannerTwo = true,
    isCategorySection = true,
    isFeaturedProductSection = true,
    isHeroCarousel = true,
    isNewProductSection = true,
    isRecipeSection = true,
    isTopSellingProductSection = true,
    logo = "",
    titleList = [],
  }: IHomepageForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.advertisementSectionImageList = advertisementSectionImageList;
    this.bannerOneImage = bannerOneImage;
    this.bannerTwoImage = bannerTwoImage;
    this.categorySectionSlugList = categorySectionSlugList;
    this.heroCarouselImageList = heroCarouselImageList;
    this.isAdvertisementSection = isAdvertisementSection;
    this.isBannerOne = isBannerOne;
    this.isBannerTwo = isBannerTwo;
    this.isCategorySection = isCategorySection;
    this.isFeaturedProductSection = isFeaturedProductSection;
    this.isHeroCarousel = isHeroCarousel;
    this.isNewProductSection = isNewProductSection;
    this.isRecipeSection = isRecipeSection;
    this.isTopSellingProductSection = isTopSellingProductSection;
    this.logo = logo;
    this.titleList = titleList;
  }
}
