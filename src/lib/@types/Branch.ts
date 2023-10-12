import type { ITitle } from "./interfaces/ITitle";

interface IBranch {
  _id?: string;
  active?: boolean;
}

export interface IBranchGet extends IBranch {
  _id: string;
  titleList: ITitle[];
  descriptionList: ITitle[];
  location: string;
}

export interface IBranchPost extends IBranch {
  titleList: ITitle[];
  descriptionList: ITitle[];
  location: string;
}

export interface IBranchDTO extends IBranch {
  titleList: ITitle[];
  descriptionList: ITitle[];
  location: string;
}

export interface IBranchForm extends IBranch {
  title?: string;
  description?: string;
  location?: string;
}

export class BranchForm implements IBranchForm {
  _id?: string;
  active?: boolean;
  title?: string;
  description?: string;
  location?: string;

  constructor({
    _id,
    active = true,
    description = "",
    location = "",
    title = "",
  }: IBranchForm = {}) {
    this._id = _id;
    this.active = active;
    this.title = title;
    this.description = description;
    this.location = location;
  }
}
