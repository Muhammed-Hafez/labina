import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { INotify } from "../@types/interfaces/INotify";
import { ILanguageDTO } from "../@types/Language";
import { customId } from "../@types/stables";

interface IAppStore {
  notifyList: INotify[];
  languageList: ILanguageDTO[];
  defaultLanguage?: ILanguageDTO;
  currentLanguage?: ILanguageDTO;
  addNotify: (notify: INotify) => void;
  setNotifyList: (notifyList: INotify[]) => void;
  setNotifyDelete: (
    notifyId?: string,
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  setLanguageList: (languageList: ILanguageDTO[]) => void;
  setDefaultLanguage: (defaultLanguage?: ILanguageDTO) => void;
  setCurrentLanguage: (currentLanguage?: ILanguageDTO) => void;
}

export const useAppStore = createWithEqualityFn<IAppStore>(
  (set) => ({
    notifyList: [],
    languageList: [],
    addNotify: ({
      _id = customId(),
      type = "info",
      message,
      variant = "filled",
    }: INotify) =>
      set((state) => ({
        ...state,
        notifyList: [...state.notifyList, { _id, type, message, variant }],
      })),
    setNotifyList: (notifyList: INotify[]) =>
      set((state) => ({
        ...state,
        notifyList,
      })),
    setNotifyDelete: (
      notifyId?: string,
      event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }

      set((state) => ({
        ...state,
        notifyList: state.notifyList.filter((x) => x._id !== notifyId),
      }));
    },
    setLanguageList: (languageList: ILanguageDTO[]) =>
      set((state) => ({
        ...state,
        languageList,
      })),
    setDefaultLanguage: (defaultLanguage?: ILanguageDTO) =>
      set((state) => ({
        ...state,
        defaultLanguage,
      })),
    setCurrentLanguage: (currentLanguage?: ILanguageDTO) =>
      set((state) => ({
        ...state,
        currentLanguage,
      })),
  }),
  shallow
);
