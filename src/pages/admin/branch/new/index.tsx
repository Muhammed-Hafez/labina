import React, { useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BranchForm } from "@/lib/@types/Branch";
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

interface IBranchProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IBranchProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function NewBranch() {
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
  } = useForm<BranchForm>({
    defaultValues: { active: true },
  });

  const onSubmit: SubmitHandler<BranchForm> = (values: BranchForm) => {
    console.log(values);
    if (!values.title || !values.description) return;

    httpAdmin
      .post("/branch", {
        ...values,
        titleList: [{ value: values.title, lang: selectedLanguage }],
        descriptionList: [
          { value: values.description, lang: selectedLanguage },
        ],
      })
      .then((res) => {
        push("/admin/branch");
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
      <h1>{t("Add new branch")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: {
                  value: true,
                  message: t("Branch name is required"),
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
                  message: t("Branch description is required"),
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
              {...register("location", {
                required: {
                  value: true,
                  message: t("Location is required"),
                },
              })}
              fullWidth
              label={t("Location")}
              error={errors.location !== undefined}
              helperText={errors.location?.message}
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
          {t("Add Branch")}
        </button>
      </form>
    </div>
  );
}

export default NewBranch;
