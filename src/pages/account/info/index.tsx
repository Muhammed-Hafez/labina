import React from "react";
import styles from "@/styles/client/account/Account.module.scss";
import { useClientStore } from "@/lib/store/clientStore";
import Link from "next/link";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

interface IAccountProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IAccountProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function Account() {
  const { userInfo } = useClientStore();

  const { t } = useTranslation();

  return (
    <section className="account__body">
      <div className={styles["account__container"]}>
        <h2 className={styles["account__title"]}>{t("My Account")}</h2>

        <div className={styles["contact__information"]}>
          <h4 className={styles["contact__title"]}>
            {t("Contact Information")}
          </h4>

          <div className={styles["contact__text"]}>
            <p className={styles["contact__name"]}>
              {t("Name")}
              <span>
                {userInfo?.user.firstName} {userInfo?.user.lastName}
              </span>
            </p>
            <p className={styles["contact__email"]}>
              {t("Email")}
              <span>{userInfo?.user.email || "Unknown"}</span>
            </p>
            <p className={styles["contact__phone"]}>
              {t("Phone Number")}
              <span>
                {userInfo?.user.phoneNumber || t("You didn’t add any number")}
              </span>
            </p>
          </div>

          <div className={styles["info__links"]}>
            <Link
              className={styles["contact__edit"]}
              href={"/account/settings"}
            >
              {t("Edit")}
            </Link>
            <span>|</span>
            <Link
              className={styles["contact__change_pass"]}
              href={"/account/change-password"}
            >
              {t("Change Password")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Account;
