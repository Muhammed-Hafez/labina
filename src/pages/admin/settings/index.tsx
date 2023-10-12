import React, { useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { AdminForm } from "@/lib/@types/Admin";
import { TextField, ButtonBase, Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Icon } from "@iconify/react";
import { useAdminStore } from "@/lib/store/adminStore";

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

const Settings = () => {
  const { push, query } = useRouter();
  const { t } = useTranslation();
  const { adminInfo, setAdminInfo } = useAdminStore();

  const [isPwHidden, setIsPwHidden] = useState(true);
  const [isNewPwHidden, setIsNewPwHidden] = useState(true);

  const [changePassword, setChangePassword] = useState(false);
  const [key, setKey] = useState(0);

  const {
    control,
    register,
    setFocus,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AdminForm>({
    defaultValues: new AdminForm({
      firstName: adminInfo?.admin.firstName,
      lastName: adminInfo?.admin.lastName,
      email: adminInfo?.admin.email,
    }),
  });

  const onSubmit: SubmitHandler<AdminForm> = (values: AdminForm) => {
    httpAdmin
      .patch("/admin/self", values)
      .then((res) => {
        setAdminInfo({
          admin: res.data.data,
          permissionList: adminInfo?.permissionList ?? [],
          token: adminInfo?.token ?? "",
        });
        push("/admin/dashboard");
      })
      .catch(() => {
        // console.log(err)
      });
  };

  return (
    <div className={`${styles["container"]} container`} key={key}>
      <h1>{t("Edit My Account")}</h1>

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

        {changePassword && (
          <>
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("password")}
                  error={errors.password !== undefined}
                  type={isPwHidden ? "password" : "text"}
                  label={t("Old Password")}
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
                    icon={
                      isPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"
                    }
                    color={isPwHidden ? "" : "var(--primary)"}
                    width="24"
                  />
                </ButtonBase>
              </div>
            </div>

            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("newPassword", {
                    minLength: {
                      value: 6,
                      message:
                        "Password is too short - should be 6 chars minimum.",
                    },
                  })}
                  error={errors.newPassword !== undefined}
                  type={isNewPwHidden ? "password" : "text"}
                  label={t("New Password")}
                  helperText={errors.newPassword?.message}
                  fullWidth
                />
                <ButtonBase
                  type="button"
                  onClick={() => {
                    setIsPwHidden((prev) => !prev);
                    setFocus("newPassword");
                  }}
                  className="icon__btn action__btn"
                >
                  <Icon
                    icon={
                      isNewPwHidden
                        ? "ic:outline-remove-red-eye"
                        : "mdi:eye-off"
                    }
                    color={isNewPwHidden ? "" : "var(--primary)"}
                    width="24"
                  />
                </ButtonBase>
              </div>
            </div>
          </>
        )}

        <div className="input__area">
          <div className="input__field">
            <Button
              type="button"
              onClick={() => {
                setChangePassword((prev) => !prev);
                setValue("password", "");
                setValue("newPassword", "");
              }}
              variant="contained"
              color={changePassword ? "error" : "info"}
            >
              {changePassword ? "Cancel" : "Change Password"}
            </Button>
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
              disabled
              error={errors.email !== undefined}
              label={t("Email")}
              helperText={errors.email?.message}
              fullWidth
            />
          </div>
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Update My Account")}
        </button>
      </form>
    </div>
  );
};

export default Settings;
