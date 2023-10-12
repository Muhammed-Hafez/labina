import React, { useEffect, useState } from "react";
import styles from "@/styles/client/Checkout.module.scss";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { IAreaPost } from "@/lib/@types/Area";
import { ICityPost } from "@/lib/@types/City";
import { ICountryPost } from "@/lib/@types/Country";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import CheckoutUser from "@/lib/components/client/checkout/CheckoutUser";
import CheckoutGuest from "@/lib/components/client/checkout/CheckoutGuest";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface ICheckoutProps extends ITranslate {
  countryList: ICountryPost[];
  cityList: ICityPost[];
  areaList: IAreaPost[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICheckoutProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    countryList: [],
    cityList: [],
    areaList: [],
  };

  try {
    const res = await httpClientSSR(req).get("/country");
    props.countryList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpClientSSR(req).get("/city");
    props.cityList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpClientSSR(req).get("/area");
    props.areaList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function Checkout(props: ICheckoutProps) {
  const { push } = useRouter();
  const { userInfo, shoppingCart } = useClientStore();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (shoppingCart.length === 0) push("/cart");
  }, []);

  return (
    <section className={styles["checkout__page"]}>
      <div className={styles["checkout__container"]}>
        {successMsg ? (
          <div className={styles["success"]}>
            <h2>
              <span style={{ color: "var(--success)" }}>
                {t("Congratulations!")}
              </span>{" "}
              {t("Your Order has been Successfully Processed!")}
            </h2>
            <p>
              {t(
                "We have sent you an email with your invoice details, check your mailbox"
              )}
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              <span style={{ color: "var(--primary)" }}>{t("Order ID:")}</span>{" "}
              {orderId ?? ""}
            </p>
          </div>
        ) : errorMsg ? (
          <div>
            <h2>
              <span style={{ color: "var(--error)" }}>
                {t("Unexpected Error!")}
              </span>
              {t("We Can't process with your order!")}
            </h2>
          </div>
        ) : userInfo ? (
          <CheckoutUser
            setSuccessMsg={setSuccessMsg}
            setErrorMsg={setErrorMsg}
            setOrderId={setOrderId}
          />
        ) : (
          <CheckoutGuest
            props={props}
            setSuccessMsg={setSuccessMsg}
            setErrorMsg={setErrorMsg}
            setOrderId={setOrderId}
          />
        )}
      </div>
    </section>
  );
}

export default Checkout;
