import React, { useState } from "react";
import styles from "@/styles/client/account/ChangePassword.module.scss";
import { ButtonBase, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { UserForm, IUserPost } from "@/lib/@types/User";
import httpClient from "@/lib/middleware/httpClient";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

interface IChangePasswordProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IChangePasswordProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const ChangePassword = () => {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [isPwHidden, setIsPwHidden] = useState(true);
  const [isNewPwHidden, setIsNewPwHidden] = useState(true);
  const [isCfrmPwHidden, setIsCfrmPwHidden] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
    trigger,
  } = useForm<UserForm>();

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    httpClient
      .patch(apiPaths.updateUserPassword, values)
      .then(() => {
        push("/account/info");
      })
      .catch((err) => {});
  };

  const checkPasswords = () =>
    getValues("confirmPassword") &&
    getValues("newPassword") !== getValues("confirmPassword")
      ? t("Passwords do not match")
      : undefined;

  return (
    <section className={styles.login__section}>
      <div className={styles.login__container}>
        <div className={styles.login__header}>
          <h2 className={styles.login__title}>{t("Change Password")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <!-- Password --> */}
          <div className="input__area">
            <div className="input__field input__with__actions">
              <TextField
                {...register("password", {
                  required: { value: true, message: t("Enter your password") },
                })}
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

          {/* <!-- New Password --> */}
          <div className="input__area">
            <div className="input__field input__with__actions">
              <TextField
                {...register("newPassword", {
                  required: { value: true, message: t("New Password") },
                  minLength: {
                    value: 6,
                    message: t(
                      "Password is too short - should be 6 chars minimum."
                    ),
                  },
                })}
                onChange={(e) => {
                  register("newPassword").onChange(e);
                  trigger("confirmPassword");
                }}
                error={errors.newPassword !== undefined}
                type={isNewPwHidden ? "password" : "text"}
                label={t("New Password")}
                helperText={errors.newPassword?.message}
                fullWidth
              />
              <ButtonBase
                type="button"
                onClick={() => {
                  setIsNewPwHidden((prev) => !prev);
                  setFocus("newPassword");
                }}
                className="icon__btn action__btn"
              >
                <Icon
                  icon={
                    isNewPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"
                  }
                  color={isNewPwHidden ? "" : "var(--primary)"}
                  width="24"
                />
              </ButtonBase>
            </div>
          </div>

          {/* <!-- Confirm Password --> */}
          <div className="input__area">
            <div className="input__field input__with__actions">
              <TextField
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: t("Confirm your password"),
                  },
                  validate: checkPasswords,
                })}
                onChange={(e) => {
                  register("confirmPassword").onChange(e);
                  trigger("confirmPassword");
                }}
                error={errors.confirmPassword !== undefined}
                type={isCfrmPwHidden ? "password" : "text"}
                label={t("Confirm New Password")}
                helperText={errors.confirmPassword?.message}
                fullWidth
              />
              <ButtonBase
                type="button"
                onClick={() => {
                  setIsCfrmPwHidden((prev) => !prev);
                  setFocus("confirmPassword");
                }}
                className="icon__btn action__btn"
              >
                <Icon
                  icon={
                    isCfrmPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"
                  }
                  color={isCfrmPwHidden ? "" : "var(--primary)"}
                  width="24"
                />
              </ButtonBase>
            </div>
          </div>

          <button className={styles.login__btn} type="submit">
            {t("Change Password")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
