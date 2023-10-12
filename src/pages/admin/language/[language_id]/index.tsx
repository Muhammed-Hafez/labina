import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LanguageForm, ILanguageGet } from "@/lib/@types/Language";
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

interface ILanguageProps extends ITranslate {
  language?: ILanguageGet;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  let props: ILanguageProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  try {
    const res = await httpAdminSSR(req).get("/language/" + query.size_id);
    props.language = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function EditSize(props: ILanguageProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  useEffect(() => {
    const title =
      props.language?.titleList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    setValue("title", title);
  }, [selectedLanguage]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LanguageForm>({ values: props.language });

  const onSubmit: SubmitHandler<LanguageForm> = (values: LanguageForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList = props.language?.titleList ?? [];

    let titleFound = false;
    for (const element of titleList) {
      const ele = element;
      if (ele.lang === selectedLanguage) {
        titleFound = true;
        element.value = values.title;
      }
    }

    if (titleFound === false)
      titleList.push({ lang: selectedLanguage, value: values.title });

    httpAdmin
      .patch("/language", {
        ...values,
        titleList,
      })
      .then((res) => {
        push("/admin/language");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <Select
        value={selectedLanguage}
        fullWidth
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

      <h1>{t("Edit Language")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: "Language name is required" },
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
                  message: "Code is required",
                },
                pattern: {
                  value: /^[a-z0-9]*$/gi,
                  message: "Code must be english letters only",
                },
              })}
              fullWidth
              label={t("ISO Code")}
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
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Update Language")}
        </button>
      </form>
    </div>
  );
}

export default EditSize;
