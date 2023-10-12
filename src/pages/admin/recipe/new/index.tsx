import React, { useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RecipeForm } from "@/lib/@types/Recipe";
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
import UploadSinglePhoto from "@/lib/components/admin/UploadSinglePhoto";

interface IRecipeProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IRecipeProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function NewRecipe() {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: { active: true, showInHome: false },
  });

  const onSubmit: SubmitHandler<RecipeForm> = (values: RecipeForm) => {
    console.log(values);
    if (!values.title || !values.description) return;

    httpAdmin
      .post("/recipe", {
        ...values,
        titleList: [{ value: values.title, lang: selectedLanguage }],
        descriptionList: [
          { value: values.description, lang: selectedLanguage },
        ],
      })
      .then((res) => {
        push("/admin/recipe");
      })
      .catch((err) => {
        // console.log(err)
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
      <h1>{t("Add new recipe")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: {
                  value: true,
                  message: t("Recipe name is required"),
                },
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
              {...register("description", {
                required: {
                  value: true,
                  message: t("Recipe description is required"),
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
          <div className="input__field">
            <TextField
              {...register("slug", {
                required: {
                  value: true,
                  message: t("Slug is required"),
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
              {...register("url", {
                required: {
                  value: true,
                  message: t("Url is required"),
                },
              })}
              fullWidth
              label={t("Url")}
              error={errors.url !== undefined}
              helperText={errors.url?.message}
            />
          </div>
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
              name="showInHome"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Show in homepage")}
                />
              )}
            />
          </div>
          {errors.showInHome && (
            <small className="error__text">{errors.showInHome.message}</small>
          )}
        </div>

        <div className="input__area">
          <UploadSinglePhoto
            location="recipe"
            title="Upload recipe photo"
            image={watch("image")}
            setImage={(val: string | undefined) => {
              setValue("image", val);
            }}
          />
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Add Recipe")}
        </button>
      </form>
    </div>
  );
}

export default NewRecipe;
