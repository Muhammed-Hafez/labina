import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styles from "@/styles/client/checkout/Success.module.scss";
import { useTranslation } from "next-i18next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetServerSideProps, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { IOrderGet } from "@/lib/@types/Order";
import apiPaths from "@/lib/@types/enum/apiPaths";
import Link from "next/link";

interface ICheckoutSuccessProps extends ITranslate {
  order: IOrderGet | null;
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  let props: ICheckoutSuccessProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    order: null,
  };

  try {
    const res = await httpClientSSR(req).get(
      `${apiPaths.orderSuccess}/${params?.token}`
    );
    props.order = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function Success(props: ICheckoutSuccessProps) {
  const { push } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.order === null) push("/checkout/error");
  }, []);

  return (
    <div className={styles["success"]}>
      <h2
        style={{
          marginBottom: "1rem",
        }}
      >
        <p style={{ color: "var(--success)", marginBottom: "0.8rem" }}>
          {t("Congratulations!")}
        </p>{" "}
        {t("Your Order has been Successfully Processed!")}
      </h2>
      <p>
        {t(
          "We have sent you an email with your invoice details, check your mailbox"
        )}
      </p>
      <p style={{ fontSize: "0.9rem" }}>
        <span style={{ color: "var(--primary)" }}>{t("Order ID:")}</span>{" "}
        {props.order?.orderId ?? ""}
      </p>

      <Link href="/" className={styles.go__home}>
        Go Home
      </Link>
    </div>
  );
}

export default Success;
