import { useClientStore } from "@/lib/store/clientStore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./Sidebar.module.scss";
import { Icon } from "@iconify/react";
import { ButtonBase, IconButton } from "@mui/material";
import httpClient from "@/lib/middleware/httpClient";
import apiPaths from "@/lib/@types/enum/apiPaths";

let sidebarLinks = [
  {
    _id: "1",
    name: "About Us",
    slug: "about",
  },
  {
    _id: "2",
    name: "New Products",
    slug: "new-products",
  },
  {
    _id: "3",
    name: "Our Branches",
    slug: "branch",
  },
  {
    _id: "4",
    name: "Promotions",
    slug: "promotions",
  },
];

const authLayoutPages = [
  {
    slug: "login",
    icon: "ph:fingerprint",
    title: "Login",
  },
  {
    slug: "register",
    icon: "mdi:register-outline",
    title: "Register",
  },
];

function Sidebar({ drawerOpen, setDrawerOpen }: any) {
  const { i18n, t } = useTranslation();
  const {
    userInfo,
    categoryNestedList,
    setUserInfo,
    setAddressList,
    setCardList,
  } = useClientStore();
  const { pathname, locale, locales, defaultLocale, push } = useRouter();
  const [drawerSubVisible, setDrawerSubVisible] = useState("");

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
  return (
    <>
      <aside
        className={`${styles["sidebar__container"]} ${
          drawerOpen ? styles["active"] : ""
        }`}
      >
        <div className={styles["sidebar"]}>
          <nav className={styles["sidebar__nav"]}>
            <div className={styles["user__info__nav"]}>
              <Icon
                className={styles["sidebar__iconify"]}
                icon={"mdi:user-circle-outline"}
              />
              <h2>
                Welcome,{" "}
                {userInfo?.user.firstName ? userInfo?.user.firstName : "Guest"}!{" "}
              </h2>
            </div>
            <hr className={styles["sidebar__hr"]} />

            <ul className={styles["sidebar__menu"]}>
              {sidebarLinks.map((sidebarLink) => (
                <li
                  className={styles["sidebar__li"]}
                  key={sidebarLink._id}
                  onClick={() => setDrawerOpen(false)}
                >
                  <Link
                    href={"/" + sidebarLink.slug}
                    className={styles["sidebar__link"]}
                  >
                    {t(sidebarLink.name)}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className={styles["sidebar__hr"]} />

            <ul className={styles["nav__menu"]}>
              {categoryNestedList?.map(
                (item) =>
                  item.active &&
                  item.showInSidebar && (
                    <li
                      key={item._id}
                      className={`${styles["nav__li"]} ${
                        item.slug !== undefined && pathname.endsWith(item.slug)
                          ? styles["active"]
                          : ""
                      }${drawerSubVisible === item._id ? " open" : ""}`}
                    >
                      <div className={styles["nav__header"]}>
                        {item.slug !== undefined ? (
                          <Link
                            href={"/category/" + item.slug}
                            className={styles["nav__link"]}
                            onClick={() => setDrawerOpen(false)}
                          >
                            <Icon
                              className={styles["sidebar__iconify"]}
                              icon={item.icon || "ep:goods"}
                            />
                            <span>
                              {item.titleList?.find((x) => x.lang === locale)
                                ?.value ||
                                item.titleList?.find(
                                  (x) => x.lang === defaultLocale
                                )?.value ||
                                ""}
                            </span>
                          </Link>
                        ) : (
                          <button
                            className={styles["nav__link"]}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDrawerSubVisible(
                                drawerSubVisible === item._id ? "" : item._id
                              );
                            }}
                          >
                            <Icon
                              className={styles["sidebar__iconify"]}
                              icon={item.icon || "ep:goods"}
                            />
                            <span>
                              {item.titleList?.find((x) => x.lang === locale)
                                ?.value ||
                                item.titleList?.find(
                                  (x) => x.lang === defaultLocale
                                )?.value ||
                                ""}
                            </span>
                          </button>
                        )}

                        {item.childList !== undefined &&
                          item.childList.length > 0 && (
                            <IconButton
                              className={styles["nav__toggler"]}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDrawerSubVisible(
                                  drawerSubVisible === item._id ? "" : item._id
                                );
                              }}
                            >
                              {/* <Icon
                                className={styles["sidebar__iconify"]}
                                icon="majesticons:chevron-down-line"
                              /> */}
                            </IconButton>
                          )}
                      </div>

                      {item.childList && item.childList.length > 0 && (
                        <div className={styles["sub__menu__container"]}>
                          <ul>
                            {item.childList.map(
                              (sub) =>
                                sub.active &&
                                sub.showInSidebar && (
                                  <li
                                    key={sub._id}
                                    className={`${styles["sub__nav__li"]} ${
                                      sub.slug !== undefined &&
                                      pathname.endsWith(sub.slug)
                                        ? styles["active"]
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      href={"/category/" + sub.slug}
                                      className={styles["sub__nav__link"]}
                                    >
                                      <Icon
                                        className={styles["sidebar__iconify"]}
                                        icon={sub.icon || "ep:goods"}
                                      />
                                      <span>
                                        {sub.titleList?.find(
                                          (x) => x.lang === locale
                                        )?.value ||
                                          sub.titleList?.find(
                                            (x) => x.lang === defaultLocale
                                          )?.value ||
                                          ""}
                                      </span>
                                    </Link>
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  )
              )}
            </ul>

            <hr className={styles["sidebar__hr"]} />

            <ul
              className={styles["nav__menu"]}
              style={{
                paddingBlock: "0.8rem",
              }}
            >
              {!userInfo ? (
                authLayoutPages.map((item) => (
                  <li
                    key={item.slug}
                    className={`${styles["nav__li"]} ${
                      item.slug !== undefined && pathname.endsWith(item.slug)
                        ? styles["active"]
                        : ""
                    }`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <div className={styles["nav__header"]}>
                      <Link
                        href={"/" + item.slug}
                        className="nav__link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyItems: "flex-start",
                          gap: "0.5rem",
                          paddingBlock: "0.7rem",
                          paddingInline: "1rem",
                        }}
                      >
                        <Icon
                          className={styles["sidebar__iconify"]}
                          icon={item.icon || "ep:goods"}
                        />
                        <span>{t(item.title)}</span>
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <div style={{ width: "100%" }}>
                  <li
                    className={`${styles["nav__li"]} ${
                      pathname.includes("account") ? styles["active"] : ""
                    }`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <div className={styles["nav__header"]}>
                      <Link
                        href={"/" + "account"}
                        className={styles["nav__link"]}
                      >
                        <Icon
                          className={styles["sidebar__iconify"]}
                          icon={"mdi:user-circle-outline"}
                        />
                        <span>{t("My Profile")}</span>
                      </Link>
                    </div>
                  </li>
                  <li
                    className={styles["nav__li"]}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <div className={styles["nav__header"]}>
                      <ButtonBase
                        className={styles["nav__link"]}
                        onClick={handleLogout}
                      >
                        <Icon
                          className={styles["sidebar__iconify"]}
                          icon={"icomoon-free:exit"}
                        />
                        <span>{t("Log Out")}</span>
                      </ButtonBase>
                    </div>
                  </li>
                </div>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {drawerOpen && (
        <button
          className={`overlay ${styles["overlay"]} ${
            drawerOpen ? styles["active"] : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setDrawerOpen(false);
          }}
        />
      )}
    </>
  );
}

export default Sidebar;
