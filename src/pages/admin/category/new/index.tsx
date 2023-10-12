import React, { useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  CategoryForm,
  ICategoryGet,
  ICategoryPost,
} from "@/lib/@types/Category";
import {
  Select,
  Checkbox,
  TextField,
  MenuItem,
  FormControlLabel,
  Autocomplete,
  Box,
  Chip,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import langTable from "@/lib/static/langTable";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IBrandGet } from "@/lib/@types/Brand";
import { ICouponGet } from "@/lib/@types/Coupon";
import { IProductGet } from "@/lib/@types/Product";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import UploadSinglePhoto from "@/lib/components/admin/UploadSinglePhoto";

interface ICategoryProps extends ITranslate {
  parentCategoryList: ICategoryGet[];
  brandList: IBrandGet[];
  promotionList: IProductGet[];
  couponList: ICouponGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICategoryProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    brandList: [],
    parentCategoryList: [],
    couponList: [],
    promotionList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/category/qand?level=0");
    props.parentCategoryList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/promotion");
    props.promotionList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/coupon");
    props.couponList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function NewCategory(props: ICategoryProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<ICategoryGet | null>(null);
  const [keywordInput, setKeywordInput] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: { active: true },
  });

  const onSubmit: SubmitHandler<CategoryForm> = (values: CategoryForm) => {
    console.log(values);
    if (values.title === undefined) return;

    const categoryData: ICategoryPost = {
      ...values,
      parent: values.parent !== "" ? values.parent : undefined,
      titleList: [{ value: values.title, lang: selectedLanguage }],
    };

    values.description &&
      (categoryData.descriptionList = [
        { value: values.description, lang: selectedLanguage },
      ]);

    httpAdmin
      .post<ICategoryGet[]>("/category", categoryData)
      .then((res) => {
        console.log(res);
        push("/admin/category");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  function handleAddToKeywordList() {
    const keywordList: string[] = getValues("keywordList") ?? [];
    if (keywordInput === "" || keywordList.includes(keywordInput)) {
      return;
    }

    keywordList.push(keywordInput);
    setValue("keywordList", keywordList);
    trigger("keywordList");
    setKeywordInput("");
  }

  function handleDeleteFromKeywordList(key: string) {
    const keywordList = getValues("keywordList")?.filter((x) => x !== key);
    setValue("keywordList", keywordList);
    trigger("keywordList");
  }

  function handleKeywordInputKeyUp(e: any) {
    if (e.keyCode === 13) {
      handleAddToKeywordList();
    }
  }

  return (
    <div className={`${styles["container"]} container`}>
      <Select
        value={selectedLanguage}
        style={{ width: "100%", marginBottom: "1.5rem" }}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
        }}
        label={t("Select language")}
      >
        {locales?.map((language) => (
          <MenuItem key={language} value={language}>
            {langTable[language]}
          </MenuItem>
        ))}
      </Select>
      <h1>{t("Add new category")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: "Category name is required" },
              })}
              fullWidth
              label={t("Name")}
              error={errors.title !== undefined}
              helperText={errors.title?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("slug", {
                required: {
                  value: true,
                  message: "Category slug is required",
                },
                pattern: {
                  value: /^[a-z0-9]+(-[a-z0-9]+)*$/i,
                  message:
                    "Only english letters and numbers ( separated by - ) are allowed",
                },
              })}
              fullWidth
              label={t("Slug")}
              error={errors.slug !== undefined}
              helperText={errors.slug?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedParentCategory}
              onChange={(_, val) => {
                setSelectedParentCategory(val);
                setValue("parent", val?._id);
                trigger("parent");
              }}
              autoHighlight
              options={props.parentCategoryList}
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
                  label={t("Parent Category")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.parent !== undefined}
                  helperText={errors.parent?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="active"
              control={control}
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
          <div className="input__field">
            <Controller
              name="showInHeader"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in header")}
                />
              )}
            />
          </div>
          {errors.showInHeader && (
            <small className="error__text">{errors.showInHeader.message}</small>
          )}
          <div className="input__field">
            <Controller
              name="showInSidebar"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in sidebar")}
                />
              )}
            />
          </div>
          {errors.showInSidebar && (
            <small className="error__text">
              {errors.showInSidebar.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="showInFooter"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in footer")}
                />
              )}
            />
          </div>
          {errors.showInFooter && (
            <small className="error__text">{errors.showInFooter.message}</small>
          )}
        </div>
        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isNewCategory"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("New Category")}
                />
              )}
            />
          </div>
          {errors.isNewCategory && (
            <small className="error__text">
              {errors.isNewCategory.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="isFeaturedCategory"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Featured Category")}
                />
              )}
            />
          </div>
          {errors.isFeaturedCategory && (
            <small className="error__text">
              {errors.isFeaturedCategory.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="showInHomepageTop"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in Homepage Top")}
                />
              )}
            />
          </div>
          {errors.showInHomepageTop && (
            <small className="error__text">
              {errors.showInHomepageTop.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="showInHomepageBottom"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in Homepage Bottom")}
                />
              )}
            />
          </div>
          {errors.showInHomepageBottom && (
            <small className="error__text">
              {errors.showInHomepageBottom.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <UploadSinglePhoto
            location="category"
            title="Upload category photo"
            image={getValues("image")}
            setImage={(val: string | undefined) => {
              setValue("image", val);
              trigger("image");
            }}
          />
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              type="text"
              value={keywordInput}
              onChange={(e) => {
                setKeywordInput(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onKeyUp={handleKeywordInputKeyUp}
              label={t(`Enter keywords list`)}
            />
            <button
              type="button"
              onClick={handleAddToKeywordList}
              className="btn__contained"
            >
              +
            </button>
          </div>
          <br />
          <div className="input__field">
            {getValues("keywordList")?.map((chip) => {
              return (
                <Chip
                  key={chip}
                  label={chip}
                  onDelete={() => {
                    handleDeleteFromKeywordList(chip);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("icon")}
              fullWidth
              label={t("Icon")}
              error={errors.icon !== undefined}
              helperText={errors.icon?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("description")}
              multiline
              fullWidth
              label={t("Description")}
              error={errors.description !== undefined}
              helperText={errors.description?.message}
            />
          </div>
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Add Category")}
        </button>
      </form>
    </div>
  );
}

export default NewCategory;
