import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { Icon } from "@iconify/react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface IContactUsProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IContactUsProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const ContactUs = () => {
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
            <Link href={breadcrumb.href} key={index}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1).replaceAll("-", " ")}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "4rem",
          overflowX: "hidden",
        }}
      >
        <div
          className="banner__logo"
          style={{ marginBottom: "2rem", width: "250px" }}
        >
          <img
            src="/images/labina-logo.png"
            alt="Labina"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>

        <div className="contact__info" style={{ padding: "1rem" }}>
          <h3
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "500",
            }}
          >
            {t("Do not hesitate to contact us anytime")}
          </h3>

          <ul style={{ listStylePosition: "inside", lineHeight: "2.5" }}>
            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              <Link
                href="tel:+201020401400"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon="ic:baseline-local-phone"
                  style={{ fontSize: "1.5rem", color: "#ea6506" }}
                />
                <span dir="ltr">010 204 01400</span>
              </Link>
            </li>

            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              <Link
                href="https://wa.me/201020401400"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon="ic:baseline-whatsapp"
                  style={{ fontSize: "1.5rem", color: "#ea6506" }}
                />
                <span dir="ltr">010 204 01400</span>
              </Link>
            </li>

            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              <Link
                href="mailto:info@hajarafa.com"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon="ic:outline-email"
                  style={{ fontSize: "1.5rem", color: "#ea6506" }}
                />
                info@hajarafa.com
              </Link>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              <Icon
                icon="material-symbols:location-on-outline"
                style={{ fontSize: "2rem", color: "#ea6506" }}
              />
              {t(
                "Block 2/19, Industrial area, Herafeya G, East Robeiki, Badr City, Cairo"
              )}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
