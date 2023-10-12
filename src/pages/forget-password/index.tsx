import React, { useState } from "react";
import styles from "@/styles/client/ForgotPassword.module.scss";
import { TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import { UserForm, IUserPost } from "@/lib/@types/User";
import httpClient from "@/lib/middleware/httpClient";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

interface IForgetPasswordProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IForgetPasswordProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function ForgotPasswordPage(props: any) {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [isPwHidden, setIsPwHidden] = useState(true);
  const [isCfrmPwHidden, setIsCfrmPwHidden] = useState(true);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
    trigger,
  } = useForm<UserForm>();

  const handleForgotPassword = async (email?: string) => {
    try {
      const response = await httpClient.post("/user/forgot-password", {
        email,
      });
      console.log(response);
      setSuccess(t("Password reset link sent to your email"));
      setTimeout(() => {
        push("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    console.log(values);
    handleForgotPassword(values.email);
  };

  const router = useRouter();

  return (
    <section className={styles.forget__password__section}>
      <div className={styles.forget__password__container}>
        <div className={styles.forget__header}>
          <h2 className={styles.forget__title}>{t("ForgetPassword")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("email", {
                  required: { value: true, message: t("Email is required") },
                  pattern: {
                    value:
                      /^[\w\-]+([\.\-\_][a-z0-9]+)*(@[\w\-]+)(\.[a-z]+)+$/gi,
                    message: t("Invalid Email"),
                  },
                })}
                error={errors.email !== undefined}
                label={t("Email")}
                helperText={errors.email?.message}
                fullWidth
              />
            </div>
          </div>

          <button className={styles.forget__btn} type="submit">
            {t("ResetPassword")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
