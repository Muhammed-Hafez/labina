import type { IAddressDTO, IAddressGet } from "./Address";
import type { IAdminDTO, IAdminGet } from "./Admin";

type accountType = {
  title: "email" | "google" | "facebook";
  typeId?: string;
};

export interface IUserInfo {
  user: IUserGet;
  token: string;
}

interface IUser {
  _id?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserGet extends IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deactivatedAt?: Date;
  bannedAt?: Date;
  bannedUntil?: Date;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  bannedBy?: IAdminGet;
  addedBy?: IAdminGet;
  lastEditedBy?: IAdminGet;
  addressList?: IAddressGet[];
  accountType: accountType[];
}

export interface IUserPost extends IUser {
  firstName?: string;
  lastName?: string;
  deactivatedAt?: string;
  bannedAt?: string;
  bannedUntil?: string;
  email?: string;
  password?: string;
  addressList?: string[];
  accountType?: accountType[];
}

export interface IUserDTO extends IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deactivatedAt?: Date;
  bannedAt?: Date;
  bannedUntil?: Date;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  bannedBy?: string | IAdminDTO;
  addedBy?: string | IAdminDTO;
  lastEditedBy?: string | IAdminDTO;
  addressList?: string[] | IAddressDTO[];
}

export interface IUserForm extends IUser {
  firstName?: string;
  lastName?: string;
  deactivatedAt?: string;
  confirmPassword?: string;
  bannedAt?: string;
  bannedUntil?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  addressList?: string[];
  accountType?: accountType[];
}

export class UserForm implements IUserForm {
  _id?: string;
  deactivatedAt?: string;
  bannedAt?: string;
  bannedUntil?: string;
  phoneNumber?: string;
  accountType?: accountType[];
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  addressList?: string[];

  constructor({
    _id,
    email = "",
    firstName = "",
    lastName = "",
    password = "",
    newPassword = "",
    confirmPassword = "",
    phoneNumber = "",
    addressList = [],
    accountType = [],
    bannedAt,
    bannedUntil,
    deactivatedAt,
  }: IUserForm = {}) {
    this._id = _id;
    this.addressList = addressList;
    this.bannedAt = bannedAt;
    this.bannedUntil = bannedUntil;
    this.deactivatedAt = deactivatedAt;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
    this.phoneNumber = phoneNumber;
    this.accountType = accountType;
  }
}
