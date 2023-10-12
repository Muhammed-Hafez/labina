import styles from "./Header.module.scss";
import React from "react";
import { ButtonBase } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import LanguageBtn from "../../LanguageBtn";

import { useAdminStore } from "@/lib/store/adminStore";

function Header({ drawerOpen, setDrawerOpen }: any) {
  const { t } = useTranslation();

  const { adminInfo } = useAdminStore();

  // console.log(adminInfo?.admin.firstName);

  return (
    <header className={styles["header"]}>
      <div className={styles["header__left"]}>
        <ButtonBase
          className={styles["burger__menu__btn"]}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDrawerOpen((prev: boolean) => !prev);
          }}
        >
          <Icon
            icon="material-symbols:menu"
            className={styles["burger__menu__icon"]}
          />
        </ButtonBase>

        <h2>{t("AdminDashboard")}</h2>
      </div>

      <div className={styles["header__right"]}>
        <span>{adminInfo?.admin.firstName}</span>
        <LanguageBtn />
      </div>
    </header>
  );
}

export default Header;
