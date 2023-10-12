import apiPaths from "@/lib/@types/enum/apiPaths";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { Icon } from "@iconify/react";
import { MenuItem, Select } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./ClientAccountLayout.module.scss";
import { useTranslation } from "next-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";

function ClientAccountLayout({ children }: any) {
  const { t } = useTranslation();

  const accountOptions = [
    {
      _id: "1",
      name: t("Account"),
      slug: "info",
    },
    {
      _id: "2",
      name: t("Orders"),
      slug: "order",
    },
    // {
    //   _id: "3",
    //   name: t("My Wishlist"),
    //   slug: "wishlist",
    // },
    {
      id: "3",
      name: t("Addresses"),
      slug: "address",
    },
    {
      _id: "4",
      name: t("Cards"),
      slug: "cards",
    },
  ];

  const { pathname, locale, push } = useRouter();
  const { userInfo, setUserInfo, setCardList, setAddressList } =
    useClientStore();
  const [selectedOpt, setSelectedOpt] = useState(
    accountOptions.find((x) => x.slug && pathname.endsWith(x.slug))?.slug ?? ""
  );

  useEffect(() => {
    setSelectedOpt(
      accountOptions.find((x) => x.slug && pathname.endsWith(x.slug))?.slug ??
        ""
    );
  }, [pathname]);

  function handleLogout() {
    try {
      httpClient
        .post(apiPaths.logout, { _id: userInfo?.user._id })
        .then(() => {
          // console.log("logout success");
        })
        .catch((err) => {})
        .finally(() => {
          setUserInfo(undefined);
          setAddressList(undefined);
          setCardList(undefined);

          if (pathname.includes("account")) push("/login");
        });
    } catch (error) {}
  }

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
      className={styles["account__section"]}
      style={{ maxWidth: "1300px", marginInline: "auto" }}
    >
      <div
        style={{
          padding: "0.5rem 1rem",
          marginBlock: "0 1rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={index}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      <div className={styles["account__container"]}>
        <aside className={styles["account__options"]}>
          {accountOptions.map((option) => (
            <Link
              key={option.slug}
              className={`${styles["option"]} ${
                pathname.endsWith("/account/" + option.slug)
                  ? styles["active"]
                  : ""
              }`}
              href={
                "/" +
                locale +
                "/account" +
                (option.slug ? "/" + option.slug : "")
              }
            >
              {option.name}
            </Link>
          ))}
          <button className={styles["logout"]} onClick={handleLogout}>
            <Icon
              className={styles["sidebar__iconify"]}
              icon={"icomoon-free:exit"}
            />
            <span>{t("Log Out")}</span>
          </button>
        </aside>

        <div className={styles["account__body"]}>
          <div className={styles["options__menu"]} id="dropDownMenu">
            <Select
              value={selectedOpt}
              onChange={(e) => {
                setSelectedOpt(e.target.value);
                push("/account" + (e.target.value ? "/" + e.target.value : ""));
              }}
              style={{ width: "100%", marginBottom: "1.5rem" }}
            >
              {accountOptions.map((option) => (
                <MenuItem
                  key={option.slug}
                  value={option.slug}
                  selected={selectedOpt === option.slug}
                >
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ClientAccountLayout;
