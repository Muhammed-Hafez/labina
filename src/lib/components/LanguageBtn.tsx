import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./LanguageBtn.module.scss";
import { Button, ButtonBase } from "@mui/material";
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
        <ButtonBase
          className={styles["lang__btn"]}
          onClick={handleLanguageMenu}
        >
          {locale}
        </ButtonBase>
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
        {locale === locales[0] ? (
          locales[1] === "ar" ? (
            <Button
              key={locales[1]}
              className={`${styles["lang__btn"]} ${styles["lang__btn__ar"]}`}
              onClick={() => handleChangeLanguage("ar")}
            >
              <Icon
                icon="twemoji:flag-italy"
                width="30"
                className={styles.lang__btn__icon}
              />
            </Button>
          ) : (
            <Button
              key={locales[1]}
              className={styles["lang__btn"]}
              onClick={() => handleChangeLanguage(locales[1])}
            >
              {locales[1]}
            </Button>
          )
        ) : locales[0] === "ar" ? (
          <Button
            key={locales[0]}
            className={`${styles["lang__btn"]} ${styles["lang__btn__ar"]}`}
            onClick={() => handleChangeLanguage("ar")}
          >
            <Icon
              icon="twemoji:flag-italy"
              width="30"
              className={styles.lang__btn__icon}
            />
          </Button>
        ) : (
          <Button
            key={locales[0]}
            className={styles["lang__btn"]}
            onClick={() => handleChangeLanguage(locales[0])}
          >
            <Icon
              icon="emojione-v1:flag-for-united-kingdom"
              width="30"
              className={styles.lang__btn__icon}
            />
          </Button>
        )}
      </div>
    ) : (
      <span></span>
    )
  ) : (
    <span></span>
  );
}

export default LanguageBtn;
