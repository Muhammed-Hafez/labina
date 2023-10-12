import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BranchForm, IBranchPost } from "@/lib/@types/Branch";
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
import { ITitle } from "@/lib/@types/interfaces/ITitle";

interface IBranchProps extends ITranslate {
  branch?: IBranchPost;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  let props: IBranchProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  try {
    const res = await httpAdminSSR(req).get("/branch/" + query.branch_id);
    props.branch = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function EditBranch(props: IBranchProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );

  useEffect(() => {
    const title =
      props.branch?.titleList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    setValue("title", title);

    const description =
      props.branch?.descriptionList?.find((x) => x.lang === selectedLanguage)
        ?.value ?? "";

    setValue("description", description);
  }, [selectedLanguage]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BranchForm>({ values: props.branch });

  const onSubmit: SubmitHandler<BranchForm> = (values: BranchForm) => {
    console.log(values);
    if (values.title === undefined || values.description === undefined) return;

    let isTitleFound = false;
    const titleList: ITitle[] = [...(props.branch?.titleList ?? [])];
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
      ...(props.branch?.descriptionList ?? []),
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
      .patch("/branch", {
        ...values,
        titleList,
        descriptionList,
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

      <h1>{t("Edit Branch")}</h1>

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
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Update Branch")}
        </button>
      </form>
    </div>
  );
}

export default EditBranch;
