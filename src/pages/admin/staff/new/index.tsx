import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AdminForm } from "@/lib/@types/Admin";
import {
  TextField,
  ButtonBase,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Icon } from "@iconify/react";
import { IRolePost } from "@/lib/@types/Role";

interface IStaffProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IStaffProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const NewStaff = () => {
  const [roleList, setRoleList] = useState([]);
  const { push } = useRouter();
  const { t } = useTranslation();
  const [isPwHidden, setIsPwHidden] = useState(true);

  const [selectedRole, setSelectedRole] = useState<IRolePost | null>(null);

  const {
    control,
    register,
    setFocus,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AdminForm>({ defaultValues: new AdminForm() });

  useEffect(() => {
    httpAdmin
      .get("/role/f")
      .then((res) => {
        setRoleList(res.data.data);
        console.log(res.data.data);
      })
      .catch(() => {});
  }, []);

  const onSubmit: SubmitHandler<AdminForm> = (values: AdminForm) => {
    httpAdmin
      .post("/admin", values)
      .then(() => {
        push("/admin/staff");
      })
      .catch(() => {
        // console.log(err)
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <h1>{t("Add new staff")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("firstName", {
                required: { value: true, message: t("First name is required") },
              })}
              fullWidth
              label={t("First Name")}
              error={errors.firstName !== undefined}
              helperText={errors.firstName?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("lastName", {
                required: { value: true, message: t("Last name is required") },
              })}
              fullWidth
              label={t("Last Name")}
              error={errors.lastName !== undefined}
              helperText={errors.lastName?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[\w\-]+([\.\-\_][a-z0-9]+)*(@[\w\-]+)(\.[a-z]+)+$/gi,
                  message: "Invalid Email",
                },
              })}
              error={errors.email !== undefined}
              label={t("Email")}
              helperText={errors.email?.message}
              fullWidth
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field input__with__actions">
            <TextField
              {...register("password", {
                required: { value: true, message: "Enter password" },
                minLength: {
                  value: 6,
                  message: "Password is too short - should be 6 chars minimum.",
                },
              })}
              error={errors.password !== undefined}
              type={isPwHidden ? "password" : "text"}
              label={t("Password")}
              helperText={errors.password?.message}
              fullWidth
            />
            <ButtonBase
              type="button"
              onClick={() => {
                setIsPwHidden((prev) => !prev);
                setFocus("password");
              }}
              className="icon__btn action__btn"
            >
              <Icon
                icon={isPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"}
                color={isPwHidden ? "" : "var(--primary)"}
                width="24"
              />
            </ButtonBase>
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
            <Autocomplete
              value={selectedRole}
              onChange={(_, val) => {
                setSelectedRole(val);
                setValue("role", val?._id);
                trigger("role");
              }}
              autoHighlight
              options={roleList}
              fullWidth
              getOptionLabel={(opt) => opt.name ?? ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Role")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.role !== undefined}
                  helperText={errors.role?.message}
                />
              )}
            />
          </div>
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Add Staff")}
        </button>
      </form>
    </div>
  );
};

export default NewStaff;
