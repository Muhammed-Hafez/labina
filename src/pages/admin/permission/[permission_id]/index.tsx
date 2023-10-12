import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IPermissionGet, PermissionForm } from "@/lib/@types/Permission";
import { Checkbox, TextField, FormControlLabel } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface IPermissionProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IPermissionProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function EditPermission() {
  const [permission, setPermission] = useState<IPermissionGet>();
  const { push, query } = useRouter();
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PermissionForm>();
  // {
  //   values: permission,
  // }

  useEffect(() => {
    async function getData() {
      try {
        const res = await httpAdmin.get("/permission/" + query.permission_id);
        setPermission(await res.data.data);
        setValue("_id", res.data.data._id);
        setValue("active", res.data.data.active);
        setValue("name", res.data.data.name);
        setValue("pathname", res.data.data.pathname);
        trigger();
      } catch (error) {}
    }

    getData();
  }, []);

  const onSubmit: SubmitHandler<PermissionForm> = (values: PermissionForm) => {
    console.log(values);

    httpAdmin
      .patch("/permission", values)
      .then(() => {
        push("/admin/permission");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <h1>{t("Edit Permission")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
                },
              })}
              fullWidth
              label={t("Name")}
              error={errors.name !== undefined}
              helperText={errors.name?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("pathname", {
                required: {
                  value: true,
                  message: "Pathname is required",
                },
                pattern: {
                  value: /([\/\-]?[a-z0-9]+)+/i,
                  message: "Invalid pathname",
                },
              })}
              fullWidth
              label={t("Pathname")}
              error={errors.pathname !== undefined}
              helperText={errors.pathname?.message}
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
          {t("Update Permission")}
        </button>
      </form>
    </div>
  );
}

export default EditPermission;
