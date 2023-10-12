import React, { useState, useEffect } from "react";
import styles from "@/styles/client/ForgotPassword.module.scss";
import { ButtonBase, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { UserForm, IUserPost } from "@/lib/@types/User";
import httpClient from "@/lib/middleware/httpClient";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { useClientStore } from "@/lib/store/clientStore";

interface IResetPasswordProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IResetPasswordProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function ResetPassword() {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [isPwHidden, setIsPwHidden] = useState(true);
  const [isCfrmPwHidden, setIsCfrmPwHidden] = useState(true);
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const token = router.query.token; // Extract token from URL

  const { lastPathname, userInfo, setUserInfo, setAddressList, setCardList } =
    useClientStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
    trigger,
  } = useForm<UserForm>();

  useEffect(() => {
    if (token) {
      httpClient
        .get(`/user/check-password/${token}`)
        .then((res) => {
          setSuccess(`${t("Password Changed Successfully")}`);
        })
        .catch((err) => {
          // console.log(err)
        });
    }
  }, [token]);

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    console.log(values);

    httpClient
      .post("/user/reset-password", {
        ...values,
        token: token,
        password: values.password,
      })
      .then((res) => {
        console.log(res);
        setSuccess(`${t("Password Changed Successfully")}`);
        setTimeout(() => {
          push("/login");
        }, 2000);
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const checkPasswords = () =>
    getValues("confirmPassword") &&
    getValues("password") !== getValues("confirmPassword")
      ? t("Passwords do not match")
      : undefined;

  return (
    <section className={styles.forget__password__section}>
      <div className={styles.forget__password__container}>
        <div className={styles.forget__header}>
          <h2 className={styles.forget__title}>{t("CreateNewPassword")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <!-- Password --> */}
          <div className="input__area">
            <div className="input__field input__with__actions">
              <TextField
                {...register("password", {
                  required: { value: true, message: t("Enter password") },
                  minLength: {
                    value: 6,
                    message: t(
                      "Password is too short - should be 6 chars minimum."
                    ),
                  },
                })}
                onChange={(e) => {
                  register("password").onChange(e);
                  trigger("confirmPassword");
                }}
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
                  icon={
                    isPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"
                  }
                  color={isPwHidden ? "" : "var(--primary)"}
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
                label={t("ConfirmPassword")}
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

          <button className={styles.forget__btn} type="submit">
            {t("UpdatePassword")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
