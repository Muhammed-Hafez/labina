import React, { useState } from "react";
import styles from "@/styles/client/Register.module.scss";
import { ButtonBase, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { UserForm, IUserPost } from "@/lib/@types/User";
import httpClient from "@/lib/middleware/httpClient";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

import Breadcrumbs from "@mui/material/Breadcrumbs";

interface IRegisterProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IRegisterProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function Register(props: any) {
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

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    console.log(values);

    httpClient
      .post(apiPaths.register, { ...values })
      .then((res) => {
        console.log(res);
        setSuccess(`${t("Your account has been created successfully")}`);
        setTimeout(() => {
          push("/login");
        }, 3000);
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

  const router = useRouter();
  const pathSegments = router.asPath.split("/");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name = segment === "" ? "Home" : segment;

    return {
      href,
      name,
    };
  });

  return (
    <section className={styles.login__section}>
      <div
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={index}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      {success ? (
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Account created successfully, check your mailbox
        </h2>
      ) : (
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <h2 className={styles.login__title}>{t("CreateNewAccount")}</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: t("First name is required"),
                    },
                  })}
                  error={errors.firstName !== undefined}
                  label={t("FirstName")}
                  helperText={errors.firstName?.message}
                  fullWidth
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: t("Last name is required"),
                    },
                  })}
                  error={errors.lastName !== undefined}
                  label={t("Last Name")}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              </div>
            </div>

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
                      isCfrmPwHidden
                        ? "ic:outline-remove-red-eye"
                        : "mdi:eye-off"
                    }
                    color={isCfrmPwHidden ? "" : "var(--primary)"}
                    width="24"
                  />
                </ButtonBase>
              </div>
            </div>

            <button className={styles.login__btn} type="submit">
              {t("SignUp")}
            </button>

            <div className={styles.custom__divider}>
              <div className={styles.divider}>{t("Orcontinuewith")}</div>
            </div>

            <div className={styles.login__with}>
              <button type="button">
                <Icon
                  icon="logos:google-icon"
                  className={styles.social__icon}
                />
                {t("Google")}
              </button>
              <button type="button">
                <Icon icon="logos:facebook" className={styles.social__icon} />
                {t("Facebook")}
              </button>
            </div>

            <div className={styles.signin__container}>
              <span>{t("Alreadyhaveanaccount?")}</span>
              <Link href="/login" className={styles.signin}>
                {t("SignIn")}
              </Link>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Register;
