import type { IPermissionDTO, IPermissionGet } from "./Permission";

interface IRole {
  _id?: string;
  active?: boolean;
  name?: string;
  level?: number;
}

export interface IRoleGet extends IRole {
  _id: string;
  name: string;
  level: number;
  permissionList: {
    permission: IPermissionGet;
    actionList: ("browse" | "add" | "edit" | "delete")[];
  }[];
}

export interface IRolePost extends IRole {
  permissionList?: {
    permission: string;
    actionList: ("browse" | "add" | "edit" | "delete")[];
  }[];
}

export interface IRoleDTO extends IRole {
  permissionList?: {
    permission: string | IPermissionGet;
    actionList: ("browse" | "add" | "edit" | "delete")[];
  }[];
}

export class RoleForm implements IRolePost {
  _id?: string;
  active?: boolean;
  name?: string;
  level?: number;
  permissionList?: {
    permission: string;
    actionList: ("browse" | "add" | "edit" | "delete")[];
  }[];

  constructor({
    _id,
    active = true,
    level,
    name = "",
    permissionList = [],
  }: IRolePost = {}) {
    this._id = _id;
    this.active = active;
    this.name = name;
    this.level = level;
    this.permissionList = permissionList;
  }
}
