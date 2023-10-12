import React, { useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SizeForm } from "@/lib/@types/Size";
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

interface ISizeProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: ISizeProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function NewSize() {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SizeForm>({
    defaultValues: { active: true },
  });

  const onSubmit: SubmitHandler<SizeForm> = (values: SizeForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList: ITitle[] = [
      { lang: selectedLanguage, value: values.title },
    ];

    httpAdmin
      .post("/size", {
        ...values,
        titleList,
      })
      .then((res) => {
        push("/admin/size");
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
      <h1>{t("Add new size")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: t("Size name is required") },
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
              {...register("code", {
                required: {
                  value: true,
                  message: t("Code is required"),
                },
                pattern: {
                  value: /^[a-z0-9]*$/gi,
                  message: t("Code must be numbers or English letters only"),
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

        <button className="btn__contained primary" type="submit">
          {t("Add Size")}
        </button>
      </form>
    </div>
  );
}

export default NewSize;
