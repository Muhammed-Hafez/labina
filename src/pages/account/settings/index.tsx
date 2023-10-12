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
import { useClientStore } from "@/lib/store/clientStore";

interface IAccountSettings extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IAccountSettings = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const AccountSettings = () => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { userInfo, setUserInfo } = useClientStore();

  const [isPwHidden, setIsPwHidden] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
  } = useForm<UserForm>({
    values: {
      firstName: userInfo?.user.firstName,
      lastName: userInfo?.user.lastName,
      email: userInfo?.user.email,
      phoneNumber: userInfo?.user.phoneNumber,
    },
  });

  const onSubmit: SubmitHandler<UserForm> = (values: IUserPost) => {
    httpClient
      .patch(apiPaths.updateUserInfo, { ...values })
      .then((res) => {
        setUserInfo({ token: userInfo?.token ?? "", user: res.data.data });
        push("/account/info");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    userInfo && (
      <section className={styles.login__section}>
        <div className={styles.login__container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("password", {
                    required: {
                      value: true,
                      message: t("Enter your password"),
                    },
                  })}
                  error={errors.password !== undefined}
                  type={isPwHidden ? "password" : "text"}
                  label={t("Your password")}
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

            <div className={styles.login__header}>
              <h2 className={styles.login__title}>
                {t("Change Your Information")}
              </h2>
            </div>

            {/* <!-- First Name --> */}
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: t("First Name is required!"),
                    },
                  })}
                  error={errors.firstName !== undefined}
                  type="text"
                  label={t("First Name")}
                  helperText={errors.firstName?.message}
                  fullWidth
                />
              </div>
            </div>

            {/* <!-- Last Name --> */}
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: t("Last Name is required!"),
                    },
                  })}
                  error={errors.lastName !== undefined}
                  type="text"
                  label={t("Last Name")}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              </div>
            </div>

            {/* <!-- Email --> */}
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("email", {
                    required: { value: true, message: t("Email is required!") },
                  })}
                  error={errors.email !== undefined}
                  type="email"
                  label={t("Email")}
                  helperText={errors.email?.message}
                  fullWidth
                />
              </div>
            </div>

            {/* <!-- Phone Number --> */}
            <div className="input__area">
              <div className="input__field input__with__actions">
                <TextField
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: t("Phone Number is required!"),
                    },
                    pattern: {
                      value: /^01[0125][0-9]{8}$/gm,
                      message: t("Invalid Phone Number"),
                    },
                  })}
                  error={errors.phoneNumber !== undefined}
                  type="text"
                  label={t("Phone Number")}
                  helperText={errors.phoneNumber?.message}
                  fullWidth
                />
              </div>
            </div>

            <button className={styles.login__btn} type="submit">
              {t("Save Changes")}
            </button>
          </form>
        </div>
      </section>
    )
  );
};

export default AccountSettings;
