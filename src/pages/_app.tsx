import "@/styles/globals.scss";
import { appWithTranslation, useTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@/lib/components/Loader";
import createCache from "@emotion/cache";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import Head from "next/head";
import Layout from "@/lib/components/Layout";
import { Alert, Snackbar, Stack } from "@mui/material";
import { useAppStore } from "@/lib/store/appStore";
import React from "react";

const cacheLtr = createCache({
  key: "muiltr",
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#e45f00",
      light: "#ff842c",
      dark: "#8f3d03",
      contrastText: "#d45900",
    },
  },
});

const ltrTheme = createTheme({ ...theme, direction: "ltr" });
const rtlTheme = createTheme({ ...theme, direction: "rtl" });

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { notifyList, setNotifyDelete } = useAppStore();

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 1);
  }, []);

  return (
    <>
      <Head>
        <title>{t("Labina")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={"/images/labina-logo.png"} />
      </Head>
      <CacheProvider value={locale === "ar" ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={locale === "ar" ? rtlTheme : ltrTheme}>
          {isAppLoading && <Loader />}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>

      <Stack spacing={2} sx={{ width: "100%" }}>
        {notifyList.map((x) => (
          <Snackbar
            key={x._id}
            open={true}
            autoHideDuration={6000}
            onClose={(e, r) => setNotifyDelete(x._id, e, r)}
          >
            <Alert
              variant="filled"
              severity={x.type}
              sx={{ width: "100%" }}
              onClose={(e) => setNotifyDelete(x._id, e)}
            >
              {x.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
      {/* <button
        onClick={() => {
          useAppStore.setState({
            notifyList: [
              ...useAppStore.getState().notifyList,
              {
                _id: customId(),
                message: "Error",
                type: "error",
              },
            ],
          });
          console.log(notifyList);
        }}
      >
        asd
      </button> */}
    </>
  );
}

export default appWithTranslation(MyApp);
