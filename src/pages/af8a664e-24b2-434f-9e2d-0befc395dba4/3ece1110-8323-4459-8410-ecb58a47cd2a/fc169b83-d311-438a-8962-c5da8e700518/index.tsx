import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";

interface IOurPrefProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IOurPrefProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function OurPref() {
  return (
    <div style={{ fontSize: "1.2rem", padding: "2rem" }}>
      Made by{" "}
      <Link
        href="https://ouddah.com"
        target="_blank"
        style={{
          fontWeight: "bold",
          color: "blue",
          textDecoration: "underline",
        }}
      >
        Ahmed Ouda
      </Link>{" "}
      &{" "}
      <Link
        href="https://ali-samir-dev.vercel.app"
        target="_blank"
        style={{
          fontWeight: "bold",
          color: "blue",
          textDecoration: "underline",
        }}
      >
        Ali Samir
      </Link>
    </div>
  );
}

export default OurPref;
