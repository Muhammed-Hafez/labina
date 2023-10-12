import apiPaths from "@/lib/@types/enum/apiPaths";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ClientAccountLayout from "../account/ClientAccountLayout";
import styles from "./ClientLayout.module.scss";
import Footer from "./Footer";
import Header from "./Header";
import Head from "next/head";

function ClientLayout({ children }: any) {
  const {
    lastPathname,
    userInfo,
    isHttpClientLoading,
    setLastPathname,
    setShoppingCart,
    setCategoryNestedList,
    setUserInfo,
    setAddressList,
    setCardList,
  } = useClientStore();
  const { pathname, push } = useRouter();
  console.log(pathname);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await httpClient.get(apiPaths.getCart);
        // console.log(res.data.data);
        setShoppingCart(await res.data.data);
      } catch (error) {
        setShoppingCart([]);
      }

      try {
        const res = await httpClient.get("/category/qor" + "?level=0");
        setCategoryNestedList(await res.data.data);
      } catch (error) {}

      try {
        const res = await httpClient.post(apiPaths.refresh);

        setUserInfo(await res.data.data);
        setAddressList(await res.data.data.addressList);
        setCardList(await res.data.data.cardList);
      } catch (error) {
        setUserInfo(undefined);
        setAddressList(undefined);
        setCardList(undefined);
      }
    };

    getData();
  }, []);

  // router guard
  useEffect(() => {
    if (
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/forget-password") &&
      !pathname.startsWith("/reset-password")
    )
      setLastPathname(pathname);

    if (!isHttpClientLoading)
      if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forget-password") ||
        pathname.startsWith("/reset-password")
      ) {
        // console.log("login page");
        userInfo && push(lastPathname);
      } else if (pathname.startsWith("/account")) {
        !userInfo && push("/login");
      }
  }, [pathname, isHttpClientLoading, userInfo]);

  return (
    <div>
      {pathname.startsWith("/cart") ||
        (pathname.startsWith("/checkout") && (
          <Head>
            <script src="https://qnbalahli.test.gateway.mastercard.com/static/checkout/checkout.min.js"></script>
          </Head>
        ))}
      {isHttpClientLoading && (
        <LinearProgress
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
          }}
        />
      )}

      <div className={styles["app"]}>
        <Header />
        <div className={styles["app__body"]}>
          {pathname.startsWith("/account") ? (
            <ClientAccountLayout>{children}</ClientAccountLayout>
          ) : (
            children
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ClientLayout;
