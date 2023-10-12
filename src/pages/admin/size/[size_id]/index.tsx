import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SizeForm, ISizePost } from "@/lib/@types/Size";
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

interface ISizeProps extends ITranslate {
  size?: ISizePost;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  let props: ISizeProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  try {
    const res = await httpAdminSSR(req).get("/size/" + query.size_id);
    props.size = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function EditSize(props: ISizeProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  useEffect(() => {
    const title =
      props.size?.titleList?.find((x) => x.lang === selectedLanguage)?.value ??
      "";

    setValue("title", title);
  }, [selectedLanguage]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SizeForm>({ values: props.size });

  const onSubmit: SubmitHandler<SizeForm> = (values: SizeForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList = props.size?.titleList ?? [];

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
      .patch("/size", {
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

      <h1>{t("Edit Size")}</h1>

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
          {t("Update Size")}
        </button>
      </form>
    </div>
  );
}

export default EditSize;
