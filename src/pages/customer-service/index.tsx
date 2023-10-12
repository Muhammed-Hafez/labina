import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface ICustomerProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ICustomerProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const CustomerService = () => {
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
    <div style={{ maxWidth: "1300px", marginInline: "auto" }}>
      <div
        style={{
          padding: "1rem 2rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={breadcrumb.name}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1).replaceAll("-", " ")}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      <p
        style={{
          marginTop: "2rem",
          textAlign: "center",
          fontSize: "1.5rem",
          color: "#ea6506",
        }}
      >
        {t("Call us:")}
        <Link
          href="tel:+201020401400"
          target="_blank"
          style={{
            color: "#000",
            marginInlineStart: "0.5rem",
          }}
        >
          010 204 01400
        </Link>
      </p>
    </div>
  );
};

export default CustomerService;
