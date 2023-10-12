import type { IRoleGet } from "./Role";

interface IPermission {
  _id?: string;
  active?: boolean;
  name?: string;
  pathname?: string;
}

export interface IPermissionGet extends IPermission {
  _id: string;
  name: string;
  pathname: string;
}

export interface IPermissionPost extends IPermission {}

export interface IPermissionDTO extends IPermission {}

export class PermissionForm implements IPermissionPost {
  _id?: string;
  active?: boolean;
  name?: string;
  pathname?: string;

  constructor({
    _id,
    active = true,
    name = "",
    pathname = "",
  }: IPermissionPost = {}) {
    this._id = _id;
    this.active = active;
    this.name = name;
    this.pathname = pathname;
  }
}
