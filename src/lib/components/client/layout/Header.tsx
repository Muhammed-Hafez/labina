import { useClientStore } from "@/lib/store/clientStore";
import { Icon } from "@iconify/react";
import { TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./Header.module.scss";
import { ButtonBase } from "@mui/material";
import Sidebar from "./Sidebar";
import LanguageBtn from "../../LanguageBtn";

const headerLinks = [
  {
    _id: "1",
    name: "Men",
    slug: "about",
  },
  {
    _id: "2",
    name: "Women",
    slug: "new-products",
  },
  {
    _id: "3",
    name: "New In",
    slug: "branch",
  },
  {
    _id: "4",
    name: "Brand",
    slug: "promotions",
  },
  {
    _id: "5",
    name: "Accessories",
    slug: "promotions",
  },
  {
    _id: "6",
    name: "Sale",
    slug: "promotions",
  },
];

function Header() {
  const { locale, defaultLocale, query, push } = useRouter();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>(
    query.search?.toString() ?? ""
  );
  const { userInfo, shoppingCart, categoryNestedList, homepageSettings } =
    useClientStore();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  // const [inputSearch, setInputSearch] = useState<string>(
  //   query.search?.toString() ?? ""
  // );
  const [drawerSubVisible, setDrawerSubVisible] = useState("");
  const { pathname } = useRouter();

  console.log(query.search);

  function handleSearch() {
    push("/product?search=" + searchInput);
    setSearchOpen(false);
  }

  function toggleSearchInput() {
    // console.log(searchOpen);
    setSearchOpen((prev) => !prev);
    // console.log(searchOpen);
  }

  return (
    <>
      <header className={styles["header"]}>
        <div className={styles["header__container"]}>
          <nav className={styles["main__header"]}>
            <div className={styles["left__content"]}>
              <Link href={"/"} className={styles["logo"]}>
                <img src={"/images/labina-logo.png"} alt="Shop Logo" />
              </Link>

              <div className={styles["left__container"]}>
                <ButtonBase
                  onClick={() => {
                    setDrawerOpen((prev) => !prev);
                  }}
                  className={`${styles["menu__icon"]} ${styles["icon__btn"]} icon__btn"]}`}
                >
                  <Icon
                    icon="ic:round-menu"
                    className={styles["header__main__iconify"]}
                  />
                </ButtonBase>
              </div>
              <LanguageBtn />
            </div>

            <div className={styles["center__content"]}>
              <Link href="/" className={styles["logo__mobile"]}>
                <img
                  src={"/images/labina-logo.png"}
                  // src={"/api/static/images/homepage/" + homepageSettings?.logo}
                  alt="Shop Logo"
                />
              </Link>

              <ul className={styles["header__links"]}>
                {headerLinks.map((headerLink) => (
                  <li className={styles["header__item"]} key={headerLink._id}>
                    <Link
                      href={"/" + headerLink.slug}
                      className={styles["header__link"]}
                    >
                      {t(headerLink.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles["right__content"]}>
              <div className={styles["search__input"]}>
                <input
                  type="search"
                  placeholder={`${t("Search here")}`}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  style={{ width: "100%" }}
                />
                <button onClick={handleSearch}>
                  <Icon icon="material-symbols:search" />
                </button>
              </div>

              <div className={styles["nav__icons"]}>
                <div className={styles["user__account"]}>
                  {userInfo ? (
                    <div className={styles["user__text"]}>
                      <Link href={"/account/info"}>
                        <Icon
                          icon="mdi:user-circle-outline"
                          className={styles["header__main__iconify"]}
                        />
                        {/* {t(`Welcome`) + " "} */}
                        {userInfo.user.firstName}
                      </Link>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Icon
                        icon="mdi:user-circle-outline"
                        className={styles["header__main__iconify"]}
                      />
                      <div className={styles["user__text"]}>
                        {/* <Link href={"/register"}>{t("Register")}</Link> */}
                        <Link href={"/login"} style={{ fontWeight: "bold" }}>
                          {t("Login")}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles["icons"]}>
                  <div className={styles["search__container"]}>
                    <ButtonBase
                      className={styles["search__icon"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSearchInput();
                      }}
                    >
                      <Icon
                        icon="ic:baseline-search"
                        className={styles["header__main__iconify"]}
                      />
                    </ButtonBase>

                    <div
                      className={`${styles["input__search"]}${
                        searchOpen ? " " + styles["active"] : ""
                      }`}
                    >
                      <div className="input__field">
                        <TextField
                          fullWidth
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSearch();
                            }
                          }}
                          label="Search"
                        />
                      </div>
                    </div>
                  </div>

                  <Link
                    className={`icon__btn ${styles["icon__btn"]} ${styles["cart__btn"]}`}
                    href={"/cart"}
                  >
                    {shoppingCart && shoppingCart.length > 0 && (
                      <div className={styles["cart__badge"]}>
                        {shoppingCart.reduce(
                          (partialSum, Link) => partialSum + Link.quantity,
                          0
                        )}
                      </div>
                    )}
                    <Icon
                      icon="uil:cart"
                      className={styles["header__main__iconify"]}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* <nav className={styles[`secondary__header`]}>
          <ul className={styles["nav__menu"]}>
            <li className={styles["nav__li"]}>
              <Link href={"/"} className={styles["nav__link"]}>
                {t("Home")}
              </Link>
            </li>
            {categoryNestedList?.map(
              (item) =>
                item.active &&
                item.showInHeader && (
                  <li
                    key={item._id}
                    className={`${styles["nav__li"]} ${
                      drawerSubVisible === item._id ? styles["active"] : ""
                    }`}
                  >
                    <div className={styles["nav__header"]}>
                      <Link
                        href={
                          item.slug === "products"
                            ? "/products"
                            : "/category/" + item.slug
                        }
                        className={styles["nav__link"]}
                      >
                        {item.titleList?.find((x) => x.lang === locale)
                          ?.value ||
                          item.titleList?.find((x) => x.lang === defaultLocale)
                            ?.value ||
                          ""}
                      </Link>

                      <button
                        className={styles["nav__toggler"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerSubVisible(
                            drawerSubVisible === item._id ? "" : item._id
                          );
                        }}
                      >
                        <Icon
                          className={styles["header__main__iconify"]}
                          icon="majesticons:chevron-down-line"
                          color={
                            drawerSubVisible === item._id ? "white" : "black"
                          }
                        />
                      </button>
                    </div>

                    {item.childList && item.childList.length > 0 && (
                      <div className={styles["sub__menu__container"]}>
                        <ul>
                          {item.childList.map(
                            (sub) =>
                              sub.active &&
                              sub.showInHeader && (
                                <li
                                  key={sub._id}
                                  className={`${styles["sub__nav__li"]}${
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
                                    <span>
                                      {sub.titleList?.find(
                                        (x) => x.lang === locale
                                      )?.value ||
                                        sub.titleList?.find(
                                          (x) => x.lang === defaultLocale
                                        )?.value ||
                                        ""}
                                    </span>

                                    <Icon
                                      icon="majesticons:chevron-right"
                                      style={{
                                        fontSize: "1.3rem",
                                        color: "#ea6506",
                                      }}
                                    />
                                  </Link>
                                </li>
                              )
                          )}
                        </ul>

                        <div className={styles["header__products__gallery"]}>
                          {item.childList?.map((product) => (
                            <Link
                              className={styles["gallery__card"]}
                              href={"/category/" + product.slug}
                              key={product._id}
                            >
                              <div className={styles["card__img"]}>
                                <img
                                  src={
                                    "/api/static/images/category/" +
                                    product.image
                                  }
                                  alt="Product Name"
                                />
                              </div>

                              <p>
                                {product.titleList?.find(
                                  (x) => x.lang === locale
                                )?.value ||
                                  product.titleList?.find(
                                    (x) => x.lang === defaultLocale
                                  )?.value ||
                                  ""}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                )
            )}
          </ul>
        </nav> */}
      </header>

      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
  );
}

export default Header;
