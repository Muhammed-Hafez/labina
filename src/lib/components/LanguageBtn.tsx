import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./LanguageBtn.module.scss";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";

function LanguageBtn() {
  const { pathname, locale, locales, defaultLocale, push, asPath } =
    useRouter();
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

  function handleLanguageMenu() {
    setLangMenuOpen((prev) => !prev);
  }

  function handleChangeLanguage(code: string) {
    setLangMenuOpen(false);
    push(pathname, asPath, {
      locale: code,
      scroll: true,
    });
  }

  return locales ? (
    locales.length > 2 ? (
      <div
        className={`${styles["lang__menu__container"]} ${
          langMenuOpen ? styles["open"] : ""
        }`}
      >
        <button className={styles["lang__btn"]} onClick={handleLanguageMenu}>
          {locale}
        </button>
        <ul className={styles["lang__menu"]}>
          {locales.map(
            (lang) =>
              lang !== locale && (
                <li key={lang}>
                  <button onClick={() => handleChangeLanguage(lang)}>
                    {lang}
                  </button>
                </li>
              )
          )}
        </ul>
        <button
          className={`overlay ${styles["overlay"]}`}
          onClick={handleLanguageMenu}
        ></button>
      </div>
    ) : locales.length === 2 ? (
      <div className={styles["lang__menu__container"]}>
        {locale === "en" ? (
          <button
            key="it"
            className={styles["lang__btn"]}
            onClick={() => handleChangeLanguage("it")}
          >
            {/* <Icon
              icon="twemoji:flag-italy"
              width="30"
              className={styles.lang__btn__icon}
            /> */}
            IT
          </button>
        ) : locale === "it" ? (
          <button
            key="en"
            className={styles["lang__btn"]}
            onClick={() => handleChangeLanguage("en")}
          >
            {/* <Icon
              icon="emojione-v1:flag-for-united-kingdom"
              width="30"
              className={styles.lang__btn__icon}
            /> */}
            EN
          </button>
        ) : null}
      </div>
    ) : (
      <span></span>
    )
  ) : (
    <span></span>
  );
}

export default LanguageBtn;
