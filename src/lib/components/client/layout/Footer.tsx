import { Icon } from "@iconify/react";
import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./Footer.module.scss";
import Link from "next/link";

function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <footer className={styles["footer"]}>
        <div className={styles["footer__container"]}>
          <ul>
            <li>
              <Link href="/about">{t("About Us")}</Link>
            </li>
            <li>
              <Link href="/customer-service">{t("Customer Service")}</Link>
            </li>
            <li>
              <Link href="/contact-us">{t("Contact Us")}</Link>
            </li>
          </ul>

          <ul>
            <li>
              <Link href="/terms-conditions">{t("Terms and Conditions")}</Link>
            </li>
            <li>
              <Link href="/privacy-policy">{t("Privacy Policy")}</Link>
            </li>
            <li>
              <Link href="/delivery-policy">{t("Delivery Policy")}</Link>
            </li>
            <li>
              <Link href="/cancelation-policy">
                {t("Return and Cancelation Policy")}
              </Link>
            </li>
          </ul>

          <ul>
            <li>
              <Link
                href="https://www.facebook.com/hajarafaeg"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon="ic:twotone-facebook"
                  className={styles["social__icons"]}
                />
                {t("Facebook")}
              </Link>
            </li>

            <li>
              <Link
                href="https://www.instagram.com/hajarafa/"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon="mdi:instagram"
                  className={styles["social__icons"]}
                />
                {t("Instagram")}
              </Link>
            </li>

            <li>
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
                  className={styles["social__icons"]}
                />
                {t("WhatsApp")}
              </Link>
            </li>

            <li>
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
                  className={styles["social__icons"]}
                />
                {t("Email")}
              </Link>
            </li>

            <li>
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
                  className={styles["social__icons"]}
                />
                {t("Phone Number")}
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles["copyright"]}>
          <div className={styles["payment"]}>
            <Icon icon="logos:visaelectron" />
            <Icon icon="logos:mastercard" />
          </div>

          <p className={styles["signture"]}>
            © {t("2023")}
            {t("Labina")}. {t("Allrightsreserved")}.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
