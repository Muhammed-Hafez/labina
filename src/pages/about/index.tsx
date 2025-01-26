import React, { useTransition } from "react";
import styles from "@/styles/client/About.module.scss";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

interface IAboutProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IAboutProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function About(props: any) {
  const { t } = useTranslation();

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
    <div
      style={{
        padding: "1rem 2rem",
        maxWidth: "1300px",
        marginInline: "auto",
      }}
    >
      <div>
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={index}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      {/* About Details Section */}
      <div id="home-right-bar-container" className="col-12 no-padding content">
        <div className="container-right row no-margin col-12 no-padding">
          <div className="cms-page-container p-2">
            <p
              style={{
                fontFamily: "Arial",
                marginBottom: "1rem",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {t("WHO WE ARE")}
            </p>

            <p
              style={{
                marginInline: "auto",
                textAlign: "center",
              }}
            >
              {t("AboutText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
