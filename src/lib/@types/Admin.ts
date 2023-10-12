import { IPermissionGet } from "./Permission";
import type { IRoleDTO, IRoleGet } from "./Role";

export interface IAdminInfo {
  admin: IAdminGet;
  token: string;
  permissionList: {
    permission: IPermissionGet;
    actionList: ("browse" | "add" | "edit" | "delete")[];
  }[];
}

interface IAdmin {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  deactivatedAt?: Date;
  bannedBy?: string;
  addedBy?: string;
  lastEditedBy?: string;
  bannedAt?: Date;
  bannedUntil?: Date;
  active?: boolean;
}
/**
 
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  deactivatedAt?: Date;
  bannedBy?: string;
  addedBy?: string;
  lastEditedBy?: string;
  bannedAt?: Date;
  bannedUntil?: Date;
  role?: string | IRoleDTO;
 */
export interface IAdminGet extends IAdmin {
  role: IRoleGet;
}

export interface IAdminPost extends IAdmin {
  newPassword?: string;
  role?: string;
}

export interface IAdminDTO extends IAdmin {
  role: string | IRoleDTO;
}

export class AdminForm implements IAdminPost {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  bannedBy?: string;
  addedBy?: string;
  lastEditedBy?: string;
  deactivatedAt?: Date;
  bannedAt?: Date;
  bannedUntil?: Date;
  role?: string;
  active?: boolean;

  constructor({
    _id,
    active = true,
    addedBy,
    bannedAt,
    bannedBy,
    bannedUntil,
    deactivatedAt,
    email = "",
    firstName = "",
    lastEditedBy,
    lastName = "",
    password = "",
    newPassword = "",
    role = "",
  }: IAdminPost = {}) {
    this._id = _id;
    this.active = active;
    this.addedBy = addedBy;
    this.bannedAt = bannedAt;
    this.bannedBy = bannedBy;
    this.bannedUntil = bannedUntil;
    this.deactivatedAt = deactivatedAt;
    this.email = email;
    this.firstName = firstName;
    this.lastEditedBy = lastEditedBy;
    this.lastName = lastName;
    this.password = password;
    this.newPassword = newPassword;
    this.role = role;
  }
}
