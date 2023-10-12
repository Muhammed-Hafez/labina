import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PromotionForm } from "@/lib/@types/Promotion";
import {
  Checkbox,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Box,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ICategoryGet, ICategoryPost } from "@/lib/@types/Category";
import { IProductGet, IProductPost } from "@/lib/@types/Product";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAutocompleteLabel } from "@/lib/@types/stables";

const promotionTypeArr = [
  { value: "all", label: "All" },
  { value: "category", label: "Some categories" },
  { value: "product", label: "Some products" },
];

interface IPromotionProps extends ITranslate {
  categoryList: ICategoryGet[];
  productList: IProductGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IPromotionProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    categoryList: [],
    productList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/category");
    props.categoryList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/product");
    props.productList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function NewPromotion(props: IPromotionProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    ICategoryGet[]
  >([]);
  const [selectedProductList, setSelectedProductList] = useState<IProductGet[]>(
    []
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PromotionForm>({
    defaultValues: { active: true },
  });

  useEffect(() => {
    setValue("start", startDate?.toDate());
    setValue("end", endDate?.toDate());

    if (startDate && startDate.isValid() === false) {
      setError("start", {
        type: "value",
        message: `${"Invalid Date"}`,
      });
    } else if (endDate && endDate.isValid() === false) {
      setError("end", {
        type: "value",
        message: `${"Invalid Date"}`,
      });
    } else if (startDate && endDate && startDate.toDate() > endDate.toDate()) {
      setError("start", {
        type: "validate",
        message: `${t("Start Date can't be more than End Date")}`,
      });
      setError("end", {
        type: "validate",
        message: `${t("End Date can't be less than Start Date")}`,
      });
    } else {
      clearErrors("start");
      clearErrors("end");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (getValues("type") === "category" && selectedCategoryList.length === 0) {
      setError("categoryList", {
        type: "required",
        message: `${t("1 category at least is required")}`,
      });
    } else {
      clearErrors("categoryList");
    }
  }, [getValues("type"), selectedCategoryList]);

  useEffect(() => {
    if (getValues("type") === "product" && selectedProductList.length === 0) {
      setError("productList", {
        type: "required",
        message: `${t("1 product at least is required")}`,
      });
    } else {
      clearErrors("productList");
    }
  }, [getValues("type"), selectedProductList]);

  const onSubmit: SubmitHandler<PromotionForm> = (values: PromotionForm) => {
    console.log(values);

    httpAdmin
      .post("/promotion", values)
      .then((res) => {
        // console.log(res);
        // successMsg = res.data.data;

        push("/admin/promotion");
      })
      .catch((err) => {
        // console.log(err);
        // errorMsg = err.response.data.message;
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <h1>{t("Add new promotion")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("code", {
                required: {
                  value: true,
                  message: t("Promotion code is required"),
                },
              })}
              fullWidth
              label={t("Code")}
              error={errors.code !== undefined}
              helperText={errors.code?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("value", {
                required: {
                  value: true,
                  message: t("Promotion value is required"),
                },
                min: {
                  value: 0.0001,
                  message: t("Min value must be more than 0"),
                },
                max: {
                  value: 99,
                  message: t("Max value is 99"),
                },
              })}
              type="number"
              fullWidth
              label={t("Percentage value")}
              error={errors.value !== undefined}
              helperText={errors.value?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("maxDiscountValue", {
                min: {
                  value: 1,
                  message: t("Min value is 1"),
                },
              })}
              type="number"
              fullWidth
              label={t("Max Discount Value")}
              error={errors.maxDiscountValue !== undefined}
              helperText={errors.maxDiscountValue?.message}
            />
          </div>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="input__area">
            <div className="input__field">
              <DatePicker
                maxDate={endDate}
                format="DD-MM-YYYY"
                label={t("Start Date")}
                value={startDate}
                onChange={(startDate) => setStartDate(startDate)}
              />
            </div>
            {errors.start && (
              <div className="error__text">{errors.start.message}</div>
            )}
          </div>

          <div className="input__area">
            <div className="input__field">
              <DatePicker
                minDate={startDate}
                format="DD-MM-YYYY"
                label={t("End Date")}
                value={endDate}
                onChange={(endDate) => setEndDate(endDate)}
              />
            </div>
            {errors.end && (
              <div className="error__text">{errors.end.message}</div>
            )}
          </div>
        </LocalizationProvider>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="active"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Active")}
                />
              )}
            />
          </div>
          {errors.active && (
            <small className="error__text">{errors.active.message}</small>
          )}
        </div>

        <div className="input__area">
          <h2>{t(`Promotion Type`)}</h2>
          <div className="input__field">
            <RadioGroup row name="type">
              {promotionTypeArr.map(({ label, value }: any) => (
                <Controller
                  key={value}
                  name="type"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t("Promotion type is required"),
                    },
                  }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Radio
                          {...field}
                          value={value}
                          checked={value === field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("type");
                          }}
                        />
                      }
                      label={t(label)}
                    />
                  )}
                />
              ))}
            </RadioGroup>
          </div>
          {getValues("type") === "product" && (
            <div className="input__field">
              <Autocomplete
                multiple
                value={selectedProductList}
                onChange={(_, val) => {
                  setSelectedProductList([...val]);
                  setValue(
                    "productList",
                    val?.map((x) => x._id)
                  );
                  trigger("productList");
                }}
                autoHighlight
                options={props.productList}
                fullWidth
                getOptionLabel={(opt) =>
                  getAutocompleteLabel(opt.titleList, locale, defaultLocale)
                }
                renderOption={(props, option) => (
                  <Box key={option._id} component="li" {...props}>
                    {getAutocompleteLabel(
                      option.titleList,
                      locale,
                      defaultLocale
                    )}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("Select Products")}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill from browser
                    }}
                    error={errors.productList !== undefined}
                    helperText={errors.productList?.message}
                  />
                )}
              />
            </div>
          )}
          {getValues("type") === "category" && (
            <div className="input__field">
              <Autocomplete
                multiple
                value={selectedCategoryList}
                onChange={(_, val) => {
                  setSelectedCategoryList([...val]);
                  setValue(
                    "categoryList",
                    val?.map((x) => x._id)
                  );
                  trigger("categoryList");
                }}
                autoHighlight
                options={props.categoryList}
                fullWidth
                getOptionLabel={(opt) =>
                  getAutocompleteLabel(opt.titleList, locale, defaultLocale)
                }
                renderOption={(props, option) => (
                  <Box key={option._id} component="li" {...props}>
                    {getAutocompleteLabel(
                      option.titleList,
                      locale,
                      defaultLocale
                    )}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("Select Categories")}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill from browser
                    }}
                    error={errors.categoryList !== undefined}
                    helperText={errors.categoryList?.message}
                  />
                )}
              />
            </div>
          )}
          {errors.type && (
            <div className="error__text">{errors.type.message}</div>
          )}
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Add Promotion")}
        </button>
      </form>
    </div>
  );
}

export default NewPromotion;
