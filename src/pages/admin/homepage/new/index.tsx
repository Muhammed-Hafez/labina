import React, { useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Select,
  Checkbox,
  TextField,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import langTable from "@/lib/static/langTable";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HomepageForm } from "@/lib/@types/Homepage";
import UploadSinglePhoto from "@/lib/components/admin/UploadSinglePhoto";
import UploadMultiPhotos from "@/lib/components/admin/UploadMultiPhotos";

interface IHomepageProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IHomepageProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function NewHomepage() {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HomepageForm>({ defaultValues: new HomepageForm() });

  const onSubmit: SubmitHandler<HomepageForm> = (values: HomepageForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList: ITitle[] = [
      { lang: selectedLanguage, value: values.title },
    ];

    httpAdmin
      .post("/homepage", {
        ...values,
        titleList,
      })
      .then((res) => {
        push("/admin/homepage");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

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
      <h1>{t("Add new homepage Settings")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: {
                  value: true,
                  message: t("Homepage name is required"),
                },
              })}
              fullWidth
              label={t("Application Title")}
              error={errors.title !== undefined}
              helperText={errors.title?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <UploadSinglePhoto
            location="homepage"
            title="Upload Logo"
            image={watch("logo")}
            setImage={(val: string | undefined) => {
              setValue("logo", val);
            }}
          />
        </div>

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
          <div className="input__field">
            <Controller
              name="isHeroCarousel"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Hero Carousel Visible")}
                />
              )}
            />
          </div>
          {errors.isHeroCarousel && (
            <small className="error__text">
              {errors.isHeroCarousel.message}
            </small>
          )}
        </div>

        {watch("isHeroCarousel") && (
          <div className="input__area">
            <UploadMultiPhotos
              location="homepage"
              title="Upload hero carousel photos"
              imgList={watch("heroCarouselImageList")}
              setImgList={(e) => {
                setValue("heroCarouselImageList", e);
              }}
            />
          </div>
        )}

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isCategorySection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Category Section Visible")}
                />
              )}
            />
          </div>
          {errors.isCategorySection && (
            <small className="error__text">
              {errors.isCategorySection.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isBannerOne"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Banner One Visible")}
                />
              )}
            />
          </div>
          {errors.isBannerOne && (
            <small className="error__text">{errors.isBannerOne.message}</small>
          )}
        </div>

        {watch("isBannerOne") && (
          <div className="input__area">
            <UploadSinglePhoto
              location="homepage"
              title="Upload Banner One Image"
              image={watch("bannerOneImage")}
              setImage={(val: string | undefined) => {
                setValue("bannerOneImage", val);
              }}
            />
          </div>
        )}

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isBannerTwo"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Banner Two Visible")}
                />
              )}
            />
          </div>
          {errors.isBannerTwo && (
            <small className="error__text">{errors.isBannerTwo.message}</small>
          )}
        </div>

        {watch("isBannerTwo") && (
          <div className="input__area">
            <UploadSinglePhoto
              location="homepage"
              title="Upload Banner Two Image"
              image={watch("bannerTwoImage")}
              setImage={(val: string | undefined) => {
                setValue("bannerTwoImage", val);
              }}
            />
          </div>
        )}

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isFeaturedProductSection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Featured Products Section Visible")}
                />
              )}
            />
          </div>
          {errors.isFeaturedProductSection && (
            <small className="error__text">
              {errors.isFeaturedProductSection.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isNewProductSection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is New Products Section Visible")}
                />
              )}
            />
          </div>
          {errors.isNewProductSection && (
            <small className="error__text">
              {errors.isNewProductSection.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isTopSellingProductSection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Top Selling Products Section Visible")}
                />
              )}
            />
          </div>
          {errors.isTopSellingProductSection && (
            <small className="error__text">
              {errors.isTopSellingProductSection.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isRecipeSection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Recipes Section Visible")}
                />
              )}
            />
          </div>
          {errors.isRecipeSection && (
            <small className="error__text">
              {errors.isRecipeSection.message}
            </small>
          )}
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="isAdvertisementSection"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Advertisement Section Visible")}
                />
              )}
            />
          </div>
          {errors.isAdvertisementSection && (
            <small className="error__text">
              {errors.isAdvertisementSection.message}
            </small>
          )}
        </div>

        {watch("isAdvertisementSection") && (
          <div className="input__area">
            <UploadMultiPhotos
              location="homepage"
              title="Upload Advertisement Section Photos"
              imgList={watch("advertisementSectionImageList")}
              setImgList={(e) => {
                setValue("advertisementSectionImageList", e);
              }}
            />
          </div>
        )}

        <button className="btn__contained primary" type="submit">
          {t("Add Homepage Settings")}
        </button>
      </form>
    </div>
  );
}

export default NewHomepage;
