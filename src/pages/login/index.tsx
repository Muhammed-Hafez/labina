import React, { useState } from "react";
import styles from "@/styles/client/Login.module.scss";
import { ButtonBase, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { UserForm, IUserPost } from "@/lib/@types/User";
import { useForm, SubmitHandler } from "react-hook-form";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

import Breadcrumbs from "@mui/material/Breadcrumbs";

interface ILoginProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ILoginProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function Login() {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [isPwHidden, setIsPwHidden] = useState(true);
  const [success, setSuccess] = useState("");

  const { lastPathname, userInfo, setUserInfo, setAddressList, setCardList } =
    useClientStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<UserForm>();

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    console.log(values);

    httpClient
      .post(apiPaths.login, {
        ...values,
      })
      .then((res) => {
        setUserInfo(res.data.data);
        setAddressList(res.data.data.addressList);
        setCardList(res.data.data.cardList);
        setSuccess(`${t("Welcome Back")}`);
        setTimeout(() => {
          push(lastPathname);
        }, 3000);
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  function handleGoogleLogin() {
    window.open("/api/user/google", "_self");
  }

  function handleFacebookLogin() {
    window.open("/api/user/facebook", "_self");
  }

  const router = useRouter();
  const pathSegments = router.asPath.split("/");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href: any = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name: any = segment === "" ? "Home" : segment;

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
            marginTop: "1rem",
          }}
        >
          {t("WelcomeBack")}, {userInfo?.user.firstName}
        </h2>
      ) : (
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <h2 className={styles.login__title}>
              {/* {$t("common.WelcomeBack")}! */}
              {t("WelcomeBack")}
            </h2>
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

            {/* <!-- Password --> */}
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("password", {
                    required: { value: true, message: t("Enter password") },
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
                    icon={
                      isPwHidden ? "ic:outline-remove-red-eye" : "mdi:eye-off"
                    }
                    color={isPwHidden ? "" : "var(--primary)"}
                    width="24"
                  />
                </ButtonBase>
              </div>
            </div>

            <button className={styles["login__btn"]} type="submit">
              {t("Login")}
            </button>

            <Link href="/forget-password" className={styles.forgot__btn}>
              {t("ForgotYourPassword?")}
            </Link>

            <div className={styles.custom__divider}>
              <div className={styles.divider}>{t("Orcontinuewith")}</div>
            </div>

            <div className={styles.login__with}>
              <button type="button" onClick={handleGoogleLogin}>
                <Icon
                  icon="logos:google-icon"
                  className={styles.social__icon}
                />
                {t("Google")}
              </button>
              <button type="button" onClick={handleFacebookLogin}>
                <Icon icon="logos:facebook" className={styles.social__icon} />
                {t("Facebook")}
              </button>
            </div>

            <div className={styles.signup__container}>
              <span>{t("Donthaveanaccount?")}</span>
              <Link href="/register" className={styles.signup}>
                {t("SignUp")}
              </Link>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Login;
