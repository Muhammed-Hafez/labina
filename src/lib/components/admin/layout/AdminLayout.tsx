import apiPaths from "@/lib/@types/enum/apiPaths";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { useAdminStore } from "@/lib/store/adminStore";
import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./AdminLayout.module.scss";
import { useTranslation } from "next-i18next";

function AdminLayout({ children }: any) {
  const { pathname, push } = useRouter();
  const { t } = useTranslation();

  const {
    setAdminInfo,
    setLastPathname,
    isHttpAdminLoading,
    adminInfo,
    lastPathname,
  } = useAdminStore();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const foundPermission = adminInfo?.permissionList.find((x) =>
    lastPathname.startsWith(x.permission.pathname)
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await httpAdmin.post(apiPaths.refreshAdmin);

        setAdminInfo(await res.data.data);
      } catch (error) {
        setAdminInfo(undefined);
      }
    };

    getData();
  }, []);

  // router guard
  useEffect(() => {
    if (!pathname.match(/\/admin\/login/))
      setLastPathname(pathname === "/admin" ? "/admin/dashboard" : pathname);

    if (!isHttpAdminLoading) {
      if (pathname.match(/\/admin\/login/)) {
        adminInfo && push(lastPathname);
      } else {
        if (adminInfo) {
          // console.log(lastPathname);

          // console.log(foundPermission);

          if (
            !(
              foundPermission &&
              ((lastPathname === foundPermission.permission.pathname &&
                foundPermission.actionList.includes("browse")) ||
                (lastPathname ===
                  foundPermission.permission.pathname + "/new" &&
                  foundPermission.actionList.includes("add")) ||
                foundPermission.actionList.includes("edit"))
            )
          )
            setTimeout(() => {
              push("/admin/dashboard");
            }, 1000);
        } else {
          push("/admin/login");
        }
      }
    }
  }, [pathname, isHttpAdminLoading, adminInfo]);

  if (pathname.match(/\/admin\/login/)) return children;

  return (
    <>
      {isHttpAdminLoading && (
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

      {adminInfo && (
        <div className={styles["app__container"]}>
          <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          <div className={styles["app"]}>
            <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <div className={styles["app__body"]}>
              {foundPermission &&
              ((lastPathname === foundPermission.permission.pathname &&
                foundPermission.actionList.includes("browse")) ||
                (lastPathname ===
                  foundPermission.permission.pathname + "/new" &&
                  foundPermission.actionList.includes("add")) ||
                foundPermission.actionList.includes("edit")) ? (
                children
              ) : (
                <h1 style={{ color: "var(--error)", padding: 32 }}>
                  {t("Access Denied")}
                </h1>
              )}
            </div>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLayout;
