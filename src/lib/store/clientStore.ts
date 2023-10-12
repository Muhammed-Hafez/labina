import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { IAddressGet } from "../@types/Address";
import { ICartGet } from "../@types/Cart";
import { ICategoryGet } from "../@types/Category";
import { ICouponPost } from "../@types/Coupon";
import { IPaymentCardGet } from "../@types/Payment";
import { IPromotionPost } from "../@types/Promotion";
import { IUserInfo } from "../@types/User";
import { IHomepageGet } from "../@types/Homepage";

interface IClientStore {
  lastPathname: string;
  homepageSettings?: IHomepageGet;
  userInfo?: IUserInfo;
  isHttpClientLoading: boolean;
  couponList?: ICouponPost[];
  promotionList?: IPromotionPost[];
  shoppingCart: ICartGet[];
  categoryNestedList?: ICategoryGet[];
  addressList?: IAddressGet[];
  cardList?: IPaymentCardGet[];
  isRefresh?: boolean;
  clientTimeout?: NodeJS.Timeout;
  setLastPathname: (lastPathname: string) => void;
  setHomepageSettings: (homepageSettings?: IHomepageGet) => void;
  setUserInfo: (userInfo?: IUserInfo) => void;
  setIsHttpClientLoading: (isHttpClientLoading: boolean) => void;
  setCouponList: (couponList?: ICouponPost[]) => void;
  setPromotionList: (promotionList?: IPromotionPost[]) => void;
  setShoppingCart: (shoppingCart: ICartGet[]) => void;
  setCategoryNestedList: (categoryNestedList?: ICategoryGet[]) => void;
  setAddressList: (addressList?: IAddressGet[]) => void;
  setCardList: (cardList?: IPaymentCardGet[]) => void;
  setIsRefresh: (isRefresh?: boolean) => void;
  setClientTimeout: (clientTimeout?: NodeJS.Timeout) => void;
}

export const useClientStore = createWithEqualityFn<IClientStore>(
  (set) => ({
    lastPathname: "/",
    isHttpClientLoading: true,
    shoppingCart: [],
    setLastPathname: (lastPathname: string) =>
      set((state) => ({
        ...state,
        lastPathname,
      })),
    setHomepageSettings: (homepageSettings?: IHomepageGet) =>
      set((state) => ({
        ...state,
        homepageSettings,
      })),
    setUserInfo: (userInfo?: IUserInfo) =>
      set((state) => ({
        ...state,
        userInfo,
      })),
    setIsHttpClientLoading: (isHttpClientLoading: boolean) =>
      set((state) => ({
        ...state,
        isHttpClientLoading,
      })),
    setCouponList: (couponList?: ICouponPost[]) =>
      set((state) => ({
        ...state,
        couponList,
      })),
    setPromotionList: (promotionList?: IPromotionPost[]) =>
      set((state) => ({
        ...state,
        promotionList,
      })),
    setShoppingCart: (shoppingCart: ICartGet[]) =>
      set((state) => ({
        ...state,
        shoppingCart,
      })),
    setCategoryNestedList: (categoryNestedList?: ICategoryGet[]) =>
      set((state) => ({
        ...state,
        categoryNestedList,
      })),
    setAddressList: (addressList?: IAddressGet[]) =>
      set((state) => ({
        ...state,
        addressList,
      })),
    setCardList: (cardList?: IPaymentCardGet[]) =>
      set((state) => ({
        ...state,
        cardList,
      })),
    setIsRefresh: (isRefresh?: boolean) =>
      set((state) => ({
        ...state,
        isRefresh,
      })),
    setClientTimeout: (clientTimeout?: NodeJS.Timeout) =>
      set((state) => ({
        ...state,
        clientTimeout,
      })),
  }),
  shallow
);
