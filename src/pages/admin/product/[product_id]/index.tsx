import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ProductForm, IProductGet, IProductPost } from "@/lib/@types/Product";
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
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IBrandGet } from "@/lib/@types/Brand";
import { ICouponGet } from "@/lib/@types/Coupon";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { ICategoryGet } from "@/lib/@types/Category";
import { IColorGet } from "@/lib/@types/Color";
import { IMaterialGet } from "@/lib/@types/Material";
import { ISizeGet } from "@/lib/@types/Size";
import UploadMultiPhotos from "@/lib/components/admin/UploadMultiPhotos";
import { ITitle } from "@/lib/@types/interfaces/ITitle";

interface IProductProps extends ITranslate {
  product?: IProductGet;
  categoryList: ICategoryGet[];
  // brandList: IBrandGet[];
  // colorList: IColorGet[];
  // materialList: IMaterialGet[];
  // sizeList: ISizeGet[];
  // productSizeList: IProductGet[];
  productRelatedList: IProductGet[];
  promotionList: IProductGet[];
  couponList: ICouponGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
}) => {
  let props: IProductProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    productRelatedList: [],
    categoryList: [],
    // brandList: [],
    // colorList: [],
    // materialList: [],
    // sizeList: [],
    // productSizeList: [],
    couponList: [],
    promotionList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/product/f/" + query.product_id);
    props.product = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/product");
    props.productRelatedList = await res.data.data;
    // props.productSizeList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/category");
    props.categoryList = await res.data.data;
  } catch (error) {}

  // try {
  //   const res = await httpAdminSSR(req).get("/brand");
  //   props.brandList = await res.data.data;
  // } catch (error) {}

  // try {
  //   const res = await httpAdminSSR(req).get("/color");
  //   props.colorList = await res.data.data;
  // } catch (error) {}

  // try {
  //   const res = await httpAdminSSR(req).get("/material");
  //   props.materialList = await res.data.data;
  // } catch (error) {}

  // try {
  //   const res = await httpAdminSSR(req).get("/size");
  //   props.sizeList = await res.data.data;
  // } catch (error) {}

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

function NewProduct(props: IProductProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );
  const [selectedCategory, setSelectedCategory] = useState<ICategoryGet | null>(
    props.product?.category ?? null
  );
  // const [selectedSize, setSelectedSize] = useState<ISizeGet | null>(
  //   props.product?.size ?? null
  // );
  // const [selectedProductSizeList, setSelectedProductSizeList] = useState<
  //   IProductGet[]
  // >(props.product?.sizeAltList ?? []);
  const [selectedRelatedProductList, setSelectedRelatedProductList] = useState<
    IProductGet[]
  >(props.product?.relatedList ?? []);
  const [keywordInput, setKeywordInput] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: new ProductForm({
      ...props.product,
      // size: props.product?.size?._id,
      category: props.product?.category._id,
      // sizeAltList: props.product?.sizeAltList?.map((x) => x._id),
      relatedList: props.product?.relatedList?.map((x) => x._id),
    }),
  });

  const onSubmit: SubmitHandler<ProductForm> = (values: ProductForm) => {
    console.log(values);
    if (values.title === undefined || values.description === undefined) return;

    let isTitleFound = false;
    const titleList: ITitle[] = [...(props.product?.titleList ?? [])];
    for (let i = 0; i < titleList.length; i++) {
      const ele = titleList[i];
      if (ele.lang === selectedLanguage) {
        isTitleFound = true;
        titleList[i].value = values.title;
      }
    }

    if (isTitleFound === false) {
      titleList.push({ lang: selectedLanguage, value: values.title });
    }

    let isDescriptionFound = false;
    const descriptionList: ITitle[] = [
      ...(props.product?.descriptionList ?? []),
    ];
    for (let i = 0; i < descriptionList.length; i++) {
      const ele = descriptionList[i];
      if (ele.lang === selectedLanguage) {
        isDescriptionFound = true;
        descriptionList[i].value = values.description;
      }
    }

    if (isDescriptionFound === false) {
      descriptionList.push({
        lang: selectedLanguage,
        value: values.description,
      });
    }

    httpAdmin
      .patch<IProductPost>("/product", {
        ...values,
        titleList,
        descriptionList,
      })
      .then((res) => {
        console.log(res);
        push("/admin/product");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    register("category", {
      required: {
        value: true,
        message: "Category is Required",
      },
    });
  }, []);

  useEffect(() => {
    const title =
      props.product?.titleList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    const description =
      props.product?.descriptionList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    setValue("title", title);
    setValue("description", description);
  }, [selectedLanguage]);

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
      <h1>{t("Update Product")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: "Product name is required" },
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
                  message: "Product slug is required",
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
            <TextField
              {...register("sku", {
                required: {
                  value: true,
                  message: "Product sku is required",
                },
                pattern: {
                  value: /^[a-z0-9]+$/i,
                  message: "Only english letters and numbers are allowed",
                },
              })}
              fullWidth
              label={t("SKU")}
              error={errors.sku !== undefined}
              helperText={errors.sku?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              type="number"
              {...register("quantity", {
                required: {
                  value: true,
                  message: "Product quantity is required",
                },
                min: {
                  value: 0,
                  message: "Quantity must be 0 or higher",
                },
                valueAsNumber: true,
              })}
              fullWidth
              label={t("Quantity")}
              error={errors.quantity !== undefined}
              helperText={errors.quantity?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              type="number"
              {...register("mainPrice", {
                required: {
                  value: true,
                  message: "Product price is required",
                },
                min: {
                  value: 1,
                  message: "Price must be 1 or higher",
                },
                valueAsNumber: true,
              })}
              fullWidth
              label={t("Price")}
              error={errors.mainPrice !== undefined}
              helperText={errors.mainPrice?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedCategory}
              onChange={(_, val) => {
                setSelectedCategory(val);
                setValue("category", val?._id);
                trigger("category");
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
                  label={t("Category")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.category !== undefined}
                  helperText={errors.category?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("description", {
                required: {
                  value: true,
                  message: "Product description is required",
                },
              })}
              multiline
              fullWidth
              label={t("Description")}
              error={errors.description !== undefined}
              helperText={errors.description?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <h2>{t(`Show product`)}</h2>
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
              name="available"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Available")}
                />
              )}
            />
          </div>
          {errors.available && (
            <small className="error__text">{errors.available.message}</small>
          )}
          <div className="input__field">
            <Controller
              name="isNewProduct"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("New product")}
                />
              )}
            />
          </div>
          {errors.isNewProduct && (
            <small className="error__text">{errors.isNewProduct.message}</small>
          )}
          <div className="input__field">
            <Controller
              name="isFeaturedProduct"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Featured product")}
                />
              )}
            />
          </div>
          {errors.isFeaturedProduct && (
            <small className="error__text">
              {errors.isFeaturedProduct.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="showNewInHome"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show new product in home")}
                />
              )}
            />
          </div>
          {errors.showNewInHome && (
            <small className="error__text">
              {errors.showNewInHome.message}
            </small>
          )}
          <div className="input__field">
            <Controller
              name="showFeaturedInHome"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show featured product in home")}
                />
              )}
            />
          </div>
          {errors.showFeaturedInHome && (
            <small className="error__text">
              {errors.showFeaturedInHome.message}
            </small>
          )}
        </div>

        {/* <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedSize}
              onChange={(_, val) => {
                setSelectedSize(val);
                setValue("size", val?._id);
                setSelectedProductSizeList([]);
                setValue("sizeAltList", undefined);
                trigger("size");
                trigger("sizeAltList");
              }}
              autoHighlight
              options={props.sizeList}
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
                  label={t("Size")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.size !== undefined}
                  helperText={errors.size?.message}
                />
              )}
            />
          </div>
        </div>

        {selectedSize && (
          <div className="input__area">
            <div className="input__field">
              <Autocomplete
                multiple
                value={selectedProductSizeList}
                onChange={(_, val) => {
                  setSelectedProductSizeList([...val]);
                  setValue(
                    "sizeAltList",
                    val?.map((x) => x._id)
                  );
                  trigger("sizeAltList");
                }}
                autoHighlight
                options={props.productSizeList}
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
                    label={t("Select Related Product Sizes")}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill from browser
                    }}
                    error={errors.sizeAltList !== undefined}
                    helperText={errors.sizeAltList?.message}
                  />
                )}
              />
            </div>
          </div>
        )} */}

        <div className="input__area">
          <UploadMultiPhotos
            location="product"
            title="Upload product photos"
            imgList={getValues("imageList")}
            mainImg={getValues("mainImage")}
            setImgList={(e) => {
              setValue("imageList", e);
              trigger("imageList");
            }}
            setMainImg={(e) => {
              setValue("mainImage", e);
              trigger("mainImage");
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
            <Autocomplete
              multiple
              value={selectedRelatedProductList}
              onChange={(_, val) => {
                setSelectedRelatedProductList([...val]);
                setValue(
                  "relatedList",
                  val?.map((x) => x._id)
                );
                trigger("relatedList");
              }}
              autoHighlight
              options={props.productRelatedList}
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
                  label={t("Select Related Product Sizes")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.relatedList !== undefined}
                  helperText={errors.relatedList?.message}
                />
              )}
            />
          </div>
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Update Product")}
        </button>
      </form>
    </div>
  );
}

export default NewProduct;
