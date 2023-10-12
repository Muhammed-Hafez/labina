import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { HomepageForm, IHomepagePost } from "@/lib/@types/Homepage";
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
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UploadMultiPhotos from "@/lib/components/admin/UploadMultiPhotos";
import UploadSinglePhoto from "@/lib/components/admin/UploadSinglePhoto";

interface IHomepageProps extends ITranslate {
  homepage: IHomepagePost;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  let props: IHomepageProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    homepage: {},
  };

  try {
    const res = await httpAdminSSR(req).get("/homepage/" + query.homepage_id);
    props.homepage = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function EditHomepage(props: IHomepageProps) {
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
  } = useForm<HomepageForm>({
    values: {
      ...props.homepage,
      title:
        props.homepage?.titleList?.find(
          (x) => x.lang === locale ?? defaultLocale ?? "en"
        )?.value ?? "",
    },
  });

  useEffect(() => {
    const title =
      props.homepage?.titleList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    setValue("title", title);
  }, [selectedLanguage]);

  const onSubmit: SubmitHandler<HomepageForm> = (values: HomepageForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList = props.homepage?.titleList ?? [];

    let titleFound = false;
    for (let i = 0; i < titleList.length; i++) {
      const ele = titleList[i];
      if (ele.lang === selectedLanguage) {
        titleFound = true;
        titleList[i].value = values.title;
      }
    }

    if (titleFound === false)
      titleList.push({ lang: selectedLanguage, value: values.title });

    httpAdmin
      .patch("/homepage", {
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
      <h1>{t("Edit homepage Settings")}</h1>

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
          {t("Update Homepage Settings")}
        </button>
      </form>
    </div>
  );
}

export default EditHomepage;
