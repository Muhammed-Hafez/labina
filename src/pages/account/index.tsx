import React, { useEffect } from "react";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

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

function AccountInfo() {
  const { push } = useRouter();

  useEffect(() => {
    // console.log("useEffect");

    push("/account/info");
  }, []);

  return <></>;
}

export default AccountInfo;
