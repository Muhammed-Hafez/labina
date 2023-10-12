import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "@/styles/admin/Admin.module.scss";
import { useTranslation } from "next-i18next";

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

function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <div className={`${styles["container"]} container`}>
      <div className={styles["container__header"]}>
        <div className={styles.dashboard__logo}>
          <img src="/images/labina-logo.png" alt="" />
        </div>
        <h2 className={styles.admin__title}>
          {t(`Welcome to Labina's Dashboard!`)}
        </h2>
      </div>
    </div>
  );
}

export default AdminDashboard;
