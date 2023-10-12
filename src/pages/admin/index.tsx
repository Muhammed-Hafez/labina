import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect } from "react";
import styles from "@/styles/admin/Admin.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

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

function Admin() {
  const { push } = useRouter();
  useEffect(() => {
    push("/admin/dashboard");
  }, []);
  return <></>;
}

export default Admin;
