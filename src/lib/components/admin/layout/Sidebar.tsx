import apiPaths from "@/lib/@types/enum/apiPaths";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { useAdminStore } from "@/lib/store/adminStore";
import { Icon } from "@iconify/react";
import { ButtonBase } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./Sidebar.module.scss";

interface IAdminLayoutPages {
  _id: string;
  icon: string;
  title: string;
  pathname?: string;
  subList?: {
    _id: string;
    pathname: string;
    icon: string;
    title: string;
  }[];
}

const allLayoutRoutes = [
  {
    _id: "1",
    pathname: "/admin/dashboard",
    icon: "mingcute:computer-line",
    title: "Dashboard",
  },
  {
    _id: "a1",
    pathname: "/admin/homepage",
    icon: "icon-park-twotone:web-page",
    title: "Homepage",
  },
  {
    _id: "2",
    icon: "carbon:catalog",
    title: "Catalog",
    subList: [
      {
        _id: "a1",
        pathname: "/admin/category",
        icon: "carbon:category",
        title: "Categories",
      },
      {
        _id: "a2",
        pathname: "/admin/product",
        icon: "fluent-mdl2:product-variant",
        title: "Products",
      },
      {
        _id: "a3",
        pathname: "/admin/recipe",
        icon: "arcticons:recipe-keeper",
        title: "Recipes",
      },
    ],
  },
  {
    _id: "33",
    icon: "tabler:discount-2",
    title: "Discounts",
    subList: [
      {
        _id: "b1",
        pathname: "/admin/promotion",
        icon: "ic:outline-discount",
        title: "Promotions",
      },

      {
        _id: "b2",
        pathname: "/admin/coupon",
        icon: "ri:coupon-3-line",
        title: "Coupons",
      },
    ],
  },
  {
    _id: "3",
    icon: "grommet-icons:configure",
    title: "General",
    subList: [
      // {
      //   _id: "c1",
      //   pathname: "/admin/language",
      //   icon: "material-symbols:language",
      //   title: "Languages",
      // },

      {
        _id: "c2",
        pathname: "/admin/branch",
        icon: "vaadin:road-branches",
        title: "Branches",
      },

      {
        _id: "c3",
        pathname: "/admin/size",
        icon: "mdi:arrow-expand",
        title: "Sizes",
      },
    ],
  },
  {
    _id: "4",
    icon: "majesticons:map-marker-area-line",
    title: "Location",
    subList: [
      {
        _id: "d1",
        pathname: "/admin/country",
        icon: "gis:search-country",
        title: "Countries",
      },

      {
        _id: "d3",
        pathname: "/admin/city",
        icon: "tabler:building-estate",
        title: "Cities",
      },
      {
        _id: "d4",
        pathname: "/admin/area",
        icon: "fluent-mdl2:product-variant",
        title: "Areas",
      },
    ],
  },
  {
    _id: "5",
    icon: "mingcute:user-2-line",
    title: "Users",
    subList: [
      {
        _id: "u4",
        pathname: "/admin/permission",
        icon: "carbon:document-protected",
        title: "Permission",
      },
      {
        _id: "u3",
        pathname: "/admin/role",
        icon: "ri:admin-line",
        title: "Roles",
      },
      {
        _id: "u2",
        pathname: "/admin/staff",
        icon: "mdi:customer-service",
        title: "Staff",
      },
      // {
      //   _id: "u1",
      //   pathname: "/admin/user",
      //   icon: "mdi:briefcase-user-outline",
      //   title: "Users",
      // },
    ],
  },
  {
    _id: "6",
    icon: "icons8:buy",
    title: "Orders",
    pathname: "/admin/order",
  },
  {
    _id: "7",
    icon: "mdi:report-bar",
    title: "Reports",
    subList: [
      {
        _id: "r1",
        pathname: "/admin/report/coupon",
        icon: "ri:coupon-3-line",
        title: "Coupons",
      },
    ],
  },
];

const authLayoutPages = [
  {
    _id: "1",
    slug: "login",
    icon: "ph:fingerprint",
    title: "Login",
  },
];

const noLayoutPages = [
  {
    _id: "1",
    slug: "landing",
    icon: "icon-park-outline:page-template",
    title: "Landing Page",
  },
  {
    _id: "2",
    slug: "profile",
    icon: "gg:profile",
    title: "Profile Page",
  },
];

function Sidebar({ drawerOpen, setDrawerOpen }: any) {
  const [drawerSubVisible, setDrawerSubVisible] = useState("");
  const { pathname, push } = useRouter();
  const { adminInfo, setAdminInfo } = useAdminStore();
  const { t } = useTranslation();
  const [adminLayoutPages, setAdminLayoutPages] = useState<IAdminLayoutPages[]>(
    []
  );

  useEffect(() => {
    // console.log(adminInfo);
    if (adminInfo) {
      setAdminLayoutPages((prev) => {
        const routeList: IAdminLayoutPages[] = [];

        for (let i = 0; i < allLayoutRoutes.length; i++) {
          const layoutRoute = allLayoutRoutes[i];

          let route: IAdminLayoutPages | undefined;

          if (
            layoutRoute.pathname &&
            adminInfo.permissionList.some(
              (x) => x.permission.pathname === layoutRoute.pathname
            )
          ) {
            route = { ...layoutRoute, subList: undefined };
          }

          if (layoutRoute.subList) {
            for (let j = 0; j < layoutRoute.subList.length; j++) {
              const sub = layoutRoute.subList[j];
              if (
                adminInfo.permissionList.some(
                  (x) => x.permission.pathname === sub.pathname
                )
              ) {
                if (!route) {
                  route = {
                    ...layoutRoute,
                    pathname: undefined,
                    subList: [sub],
                  };
                } else if (!route.subList) {
                  route.subList = [sub];
                } else {
                  route.subList.push(sub);
                }
              }
            }
          }

          if (route) routeList.push(route);
        }

        return routeList;
      });
    }
  }, [adminInfo]);

  function handleLogout() {
    try {
      httpAdmin
        .post(apiPaths.logoutAdmin, { _id: adminInfo?.admin._id })
        .then(() => {
          // console.log("logout success");
        })
        .catch((err) => {})
        .finally(() => {
          setAdminInfo(undefined);
          push("/admin/login");
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
            <ul className={styles["nav__menu"]}>
              {adminLayoutPages.map((item) => (
                <li
                  key={item._id}
                  className={`${styles["nav__li"]} ${
                    pathname === item.pathname ? styles["active"] : ""
                  } ${drawerSubVisible === item._id ? styles["open"] : ""}`}
                >
                  <div className={styles["nav__header"]}>
                    {item.pathname ? (
                      <Link
                        href={item.pathname}
                        className={styles["nav__link"]}
                      >
                        <Icon
                          className={styles["sidebar__iconify"]}
                          icon={item.icon ?? ""}
                        />
                        <span>{t(item.title)}</span>
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
                          icon={item.icon ?? ""}
                        />
                        <span>{t(item.title)}</span>
                      </button>
                    )}

                    {item.subList && item.subList.length > 0 && (
                      <ButtonBase
                        className={styles["nav__toggler"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerSubVisible(
                            drawerSubVisible === item._id ? "" : item._id
                          );
                        }}
                      >
                        <Icon
                          className={styles["sidebar__iconify"]}
                          icon="majesticons:chevron-down-line"
                        />
                      </ButtonBase>
                    )}
                  </div>

                  {item.subList && (
                    <div className={styles["sub__menu__container"]}>
                      <ul>
                        {item.subList.map((sub) => (
                          <li
                            key={sub._id}
                            className={`${styles["sub__nav__li"]} ${
                              pathname === sub.pathname ? styles["active"] : ""
                            }`}
                          >
                            <ButtonBase
                              LinkComponent={Link}
                              href={sub.pathname}
                              className={styles["sub__nav__link"]}
                            >
                              <Icon
                                className={styles["sidebar__iconify"]}
                                icon={sub.icon}
                              />
                              <span>{t(sub.title)}</span>
                            </ButtonBase>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <hr className={styles["sidebar__hr"]} />
            <ul className={styles["nav__menu"]}>
              <li className={styles[`nav__li`]}>
                <div className={styles["nav__header"]}>
                  <Link href="/admin/settings" className={styles["nav__link"]}>
                    <Icon
                      className={styles["sidebar__iconify"]}
                      icon="solar:settings-bold"
                    />
                    <span>{t("Settings")}</span>
                  </Link>
                </div>
              </li>
              <li className={styles[`nav__li`]}>
                <div className={styles["nav__header"]}>
                  <ButtonBase
                    className={styles["nav__link"]}
                    onClick={handleLogout}
                  >
                    <Icon
                      className={styles["sidebar__iconify"]}
                      icon={"icomoon-free:exit"}
                    />
                    <span>{t(`Logout`)}</span>
                  </ButtonBase>
                </div>
              </li>
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
