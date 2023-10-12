import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { IAdminInfo } from "../@types/Admin";

interface IAdminStore {
  lastPathname: string;
  adminInfo?: IAdminInfo;
  isHttpAdminLoading: boolean;
  isAdminRefresh?: boolean;
  adminTimeout?: NodeJS.Timeout;
  setLastPathname: (lastPathname: string) => void;
  setAdminInfo: (adminInfo?: IAdminInfo) => void;
  setIsHttpAdminLoading: (isHttpAdminLoading?: boolean) => void;
  setIsAdminRefresh: (isAdminRefresh?: boolean) => void;
  setAdminTimeout: (adminTimeout?: NodeJS.Timeout) => void;
}

export const useAdminStore = createWithEqualityFn<IAdminStore>(
  (set) => ({
    lastPathname: "/admin/dashboard",
    isHttpAdminLoading: true,
    setLastPathname: (lastPathname: string) =>
      set((state) => ({
        ...state,
        lastPathname,
      })),
    setAdminInfo: (adminInfo?: IAdminInfo) =>
      set((state) => ({
        ...state,
        adminInfo,
      })),
    setIsHttpAdminLoading: (isHttpAdminLoading?: boolean) =>
      set((state) => ({
        ...state,
        isHttpAdminLoading,
      })),
    setIsAdminRefresh: (isAdminRefresh?: boolean) =>
      set((state) => ({
        ...state,
        isAdminRefresh,
      })),
    setAdminTimeout: (adminTimeout?: NodeJS.Timeout) =>
      set((state) => ({
        ...state,
        adminTimeout,
      })),
  }),
  shallow
);
