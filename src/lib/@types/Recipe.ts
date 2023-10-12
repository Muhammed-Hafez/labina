import type { ITitle } from "./interfaces/ITitle";

interface IRecipe {
  _id?: string;
  active?: boolean;
  showInHome?: boolean;
  image?: string;
}

export interface IRecipeGet extends IRecipe {
  _id: string;
  titleList: ITitle[];
  descriptionList: ITitle[];
  url: string;
  slug: string;
}

export interface IRecipePost extends IRecipe {
  titleList: ITitle[];
  descriptionList: ITitle[];
  url: string;
  slug: string;
}

export interface IRecipeDTO extends IRecipe {
  titleList: ITitle[];
  descriptionList: ITitle[];
  url: string;
  slug: string;
}

export interface IRecipeForm extends IRecipe {
  title?: string;
  description?: string;
  url?: string;
  slug?: string;
}

export class RecipeForm implements IRecipeForm {
  _id?: string;
  active?: boolean;
  showInHome?: boolean;
  title?: string;
  description?: string;
  url?: string;
  slug?: string;
  image?: string;

  constructor({
    _id,
    active = true,
    description = "",
    image = "",
    showInHome = false,
    slug = "",
    title = "",
    url = "",
  }: IRecipeForm = {}) {
    this._id = _id;
    this.active = active;
    this.showInHome = showInHome;
    this.title = title;
    this.description = description;
    this.url = url;
    this.slug = slug;
    this.image = image;
  }
}
