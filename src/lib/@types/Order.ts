import type { IAddressDTO, IAddressGet } from "./Address";
import type { IAreaDTO, IAreaGet } from "./Area";
import type { ICityDTO, ICityGet } from "./City";
import type { ICountryDTO, ICountryGet } from "./Country";
import type { ICouponDTO, ICouponGet } from "./Coupon";
import type { IPaymentCardGet } from "./Payment";
import type { IProductGet } from "./Product";
import type { IPromotionGet } from "./Promotion";
import type { ISizeGet } from "./Size";
import type { IUserGet } from "./User";
import { orderStatus, paymentType } from "./stables";

interface IOrder {
  paymentMethod?: paymentType | "";
  subTotal?: number;
  netTotal?: number;
  status?: orderStatus | "";
  active?: boolean;
  viewedBy?: string;
  confirmedBy?: string;
  shipToAnotherAddress?: boolean;

  orderId?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  streetName?: string;
  buildingNumber?: string;
  floorNumber?: string;
  landMark?: string;
  phoneNumber?: string;

  billingFirstName?: string;
  billingLastName?: string;
  billingEmail?: string;
  billingStreetName?: string;
  billingBuildingNumber?: string;
  billingFloorNumber?: string;
  billingLandMark?: string;
  billingPhoneNumber?: string;
}

export interface IOrderGet extends IOrder {
  _id: string;
  productList: {
    _id: string;
    product: IProductGet;
    quantity: number;
    price: number;
    priceAfterDiscount: number;
    size: ISizeGet;
    sizeCode: string;
    promotion: IPromotionGet;
    promotionCode: string;
    promotionValue: number;
    isPromotionPercentage: boolean;
  }[];
  subTotal: number;
  netTotal: number;
  status: orderStatus;
  user: IUserGet;
  paymentToken: IPaymentCardGet;
  coupon: ICouponGet;
  active: boolean;
  shipToAnotherAddress: boolean;
  orderId: string;

  shippingPrice: number;

  couponCode: string;
  couponTotalValue: number;
  promotionTotalValue: number;

  address: IAddressGet;
  country: ICountryGet;
  city: ICityGet;
  area: IAreaGet;
  firstName: string;
  lastName: string;
  email: string;
  streetName: string;
  buildingNumber: string;
  floorNumber: string;
  landMark: string;
  phoneNumber: string;

  billingAddress: IAddressGet;
  billingCountry: ICountryGet;
  billingCity: ICityGet;
  billingArea: IAreaGet;
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingStreetName: string;
  billingBuildingNumber: string;
  billingFloorNumber: string;
  billingLandMark: string;
  billingPhoneNumber: string;

  createdAt: string;
  updatedAt: string;
}

export interface IOrderPost extends IOrder {
  country?: string;
  city?: string;
  area?: string;
  address?: string;
  billingCountry?: string;
  billingCity?: string;
  billingArea?: string;
  billingAddress?: string;

  paymentMethod?: paymentType | "";
  paymentToken?: string;
  subTotal?: number;
  netTotal?: number;
  coupon?: string;
  status?: orderStatus | "";
  user?: string;
  cvv?: string;
  isCardWithoutSave?: boolean;

  orderId?: string;
  referenceId?: string;
  transactionId?: string;
}

export interface IOrderDTO extends IOrder {
  country: ICountryDTO | string;
  city: ICityDTO | string;
  area: IAreaDTO | string;
  address?: IAddressDTO | string;
  billingCountry?: ICountryDTO | string;
  billingCity?: ICityDTO | string;
  billingArea?: IAreaDTO | string;
  billingAddress?: IAddressDTO | string;
  coupon?: ICouponDTO | string;
}

export class OrderForm implements IOrderPost {
  address?: string;
  billingAddress?: string;
  paymentMethod?: paymentType | "";
  paymentToken?: string;
  coupon?: string;
  status?: orderStatus | "";
  active?: boolean;
  viewedBy?: string;
  confirmedBy?: string;
  shipToAnotherAddress?: boolean;
  cvv?: string;
  isCardWithoutSave?: boolean;
  orderId?: string;
  referenceId?: string;
  transactionId?: string;

  constructor({
    active = true,
    address = "",
    billingAddress = "",
    coupon = "",
    cvv = "",
    paymentMethod = "",
    paymentToken = "",
    shipToAnotherAddress = false,
    status = "",
    orderId = "",
    referenceId = "",
    transactionId = "",
    isCardWithoutSave = false,
    viewedBy,
    confirmedBy,
  }: OrderForm = {}) {
    this.active = active;
    this.address = address;
    this.billingAddress = billingAddress;
    this.coupon = coupon;
    this.cvv = cvv;
    this.paymentMethod = paymentMethod;
    this.paymentToken = paymentToken;
    this.shipToAnotherAddress = shipToAnotherAddress;
    this.status = status;
    this.orderId = orderId;
    this.referenceId = referenceId;
    this.transactionId = transactionId;
    this.isCardWithoutSave = isCardWithoutSave;
    this.viewedBy = viewedBy;
    this.confirmedBy = confirmedBy;
  }
}

export class OrderFormGuest extends OrderForm {
  country?: string;
  city?: string;
  area?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  streetName?: string;
  buildingNumber?: string;
  floorNumber?: string;
  landMark?: string;
  phoneNumber?: string;
  billingCountry?: string;
  billingCity?: string;
  billingArea?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingEmail?: string;
  billingStreetName?: string;
  billingBuildingNumber?: string;
  billingFloorNumber?: string;
  billingLandMark?: string;
  billingPhoneNumber?: string;

  constructor({
    active,
    address,
    area,
    billingAddress,
    billingArea,
    billingBuildingNumber,
    billingCity,
    billingCountry,
    billingEmail,
    billingFirstName,
    billingFloorNumber,
    billingLandMark,
    billingLastName,
    billingPhoneNumber,
    billingStreetName,
    buildingNumber,
    city,
    confirmedBy,
    country,
    coupon,
    cvv,
    email,
    firstName,
    floorNumber,
    landMark,
    lastName,
    paymentMethod,
    paymentToken,
    phoneNumber,
    shipToAnotherAddress,
    status,
    isCardWithoutSave,
    streetName,
    viewedBy,
  }: OrderFormGuest = {}) {
    super({
      active,
      address,
      billingAddress,
      confirmedBy,
      coupon,
      cvv,
      paymentMethod,
      paymentToken,
      shipToAnotherAddress,
      status,
      isCardWithoutSave,
      viewedBy,
    });
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.streetName = streetName;
    this.buildingNumber = buildingNumber;
    this.floorNumber = floorNumber;
    this.landMark = landMark;
    this.phoneNumber = phoneNumber;
    this.country = country;
    this.city = city;
    this.area = area;
    this.billingCountry = billingCountry;
    this.billingCity = billingCity;
    this.billingArea = billingArea;
    this.billingFirstName = billingFirstName;
    this.billingLastName = billingLastName;
    this.billingEmail = billingEmail;
    this.billingStreetName = billingStreetName;
    this.billingBuildingNumber = billingBuildingNumber;
    this.billingFloorNumber = billingFloorNumber;
    this.billingLandMark = billingLandMark;
    this.billingPhoneNumber = billingPhoneNumber;
  }
}
