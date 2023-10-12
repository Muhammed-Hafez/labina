import React, { useRef, useState } from "react";
import styles from "@/styles/admin/Login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUserPost, UserForm } from "@/lib/@types/User";
import { useAdminStore } from "@/lib/store/adminStore";
import { useTranslation } from "next-i18next";
import httpAdmin from "@/lib/middleware/httpAdmin";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { useRouter } from "next/router";
import { ButtonBase, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface ILoginProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: ILoginProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function Login() {
  const [isPwHidden, setIsPwHidden] = useState(true);
  const { push } = useRouter();
  const { t } = useTranslation();
  const { adminInfo, lastPathname, setAdminInfo } = useAdminStore();
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<UserForm>();

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    console.log(values);

    httpAdmin
      .post(apiPaths.loginAdmin, {
        ...values,
      })
      .then((res) => {
        setAdminInfo(res.data.data);
        console.log(res);
        setSuccess("Welcome Back");

        push(lastPathname);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <section className={styles["login__section"]}>
      <div className={styles.login__logo}>
        <img src="/images/labina-logo.png" alt="logo" />
      </div>

      <div>
        {success ? (
          <h2
            style={{
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            {t("WelcomeBack")}, {adminInfo?.admin.firstName}
          </h2>
        ) : (
          <div className={styles["login__container"]}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="input__area">
                <div className="input__field">
                  <TextField
                    {...register("email", {
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value:
                          /^[\w\-]+([\.\-\_][a-z0-9]+)*(@[\w\-]+)(\.[a-z]+)+$/gi,
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

              {/* <!-- Password --> */}
              <div className="input__area">
                <div className="input__field input__with__actions">
                  <TextField
                    {...register("password", {
                      required: { value: true, message: "Enter password" },
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
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
