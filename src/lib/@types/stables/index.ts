export const getAutocompleteLabel = (
  titleList: any,
  locale?: string,
  defaultLocale?: string
) => {
  let defaultTitle = "";
  for (let i = 0; i < titleList?.length; i++) {
    const ele = titleList[i];
    if (ele.lang === locale) return ele.value as string;
    if (ele.lang === defaultLocale) defaultTitle = ele.value;
  }
  return defaultTitle;
};

export const isStringNullOrEmpty = (str: string | null | undefined) =>
  str === undefined ||
  str === null ||
  typeof str !== "string" ||
  str.replace(" ", "") === "";

export const customId = () =>
  (+(new Date().getTime() + (Math.random() * 10 ** 6).toFixed(0)))
    .toString(36)
    .toUpperCase();

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const colorNames = [
  "Red",
  "Blue",
  "Yellow",
  "Green",
  "Purple",
  "Orange",
];

export type orderStatus =
  | "pending"
  | "new"
  | "viewed"
  | "confirmed"
  | "rejected"
  | "cancelled";

export type paymentType = "cash" | "card";
