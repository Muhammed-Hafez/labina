import "@splidejs/react-splide/css/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./Recipe.module.scss";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Link from "next/link";

let tabs = [
  {
    _id: "1",
    icon: "emojione-monotone:green-salad",
    label: "StartersSalads",
  },
  {
    _id: "2",
    icon: "ep:dish-dot",
    label: "MainCourses",
  },
  {
    _id: "3",
    icon: "game-icons:wrapped-sweet",
    label: "Desserts",
  },
];

let recipes1Data = [
  {
    _id: "1",
    imgUrl: "/images/recipes/recipe-1.jpeg",
    name: "Recipe 1",
    slug: "recipe-1",
  },
  {
    _id: "2",
    imgUrl: "/images/recipes/recipe-2.jpeg",
    name: "Recipe 2",
    slug: "recipe-2",
  },
  {
    _id: "3",
    imgUrl: "/images/recipes/recipe-3.jpeg",
    name: "Recipe 3",
    slug: "recipe-3",
  },
  {
    _id: "4",
    imgUrl: "/images/recipes/recipe-4.jpeg",
    name: "Recipe 4",
    slug: "recipe-4",
  },
  {
    _id: "5",
    imgUrl: "/images/recipes/recipe-5.jpeg",
    name: "Recipe 5",
    slug: "recipe-5",
  },
];

let recipes2Data = [
  {
    _id: "1",
    imgUrl: "/images/recipes/recipe-6.jpeg",
    name: "Recipe 1",
    slug: "recipe-1",
  },
  {
    _id: "2",
    imgUrl: "/images/recipes/recipe-7.jpeg",
    name: "Recipe 2",
    slug: "recipe-2",
  },
  {
    _id: "3",
    imgUrl: "/images/recipes/recipe-8.jpeg",
    name: "Recipe 3",
    slug: "recipe-3",
  },
  {
    _id: "4",
    imgUrl: "/images/recipes/recipe-9.jpeg",
    name: "Recipe 4",
    slug: "recipe-4",
  },
  {
    _id: "5",
    imgUrl: "/images/recipes/recipe-10.jpeg",
    name: "Recipe 5",
    slug: "recipe-5",
  },
];

let recipes3Data = [
  {
    _id: "1",
    imgUrl: "/images/recipes/recipe-11.jpeg",
    name: "Recipe 1",
    slug: "recipe-1",
  },
  {
    _id: "2",
    imgUrl: "/images/recipes/recipe-12.jpeg",
    name: "Recipe 2",
    slug: "recipe-2",
  },
  {
    _id: "3",
    imgUrl: "/images/recipes/recipe-13.jpeg",
    name: "Recipe 3",
    slug: "recipe-3",
  },
  {
    _id: "4",
    imgUrl: "/images/recipes/recipe-14.jpeg",
    name: "Recipe 4",
    slug: "recipe-4",
  },
  {
    _id: "5",
    imgUrl: "/images/recipes/recipe-15.jpeg",
    name: "Recipe 5",
    slug: "recipe-5",
  },
];

function Recipe() {
  const [activeTab, setActiveTab] = useState("");
  const { locale } = useRouter();
  const { t } = useTranslation();
  const recipeList =
    activeTab === "2"
      ? recipes2Data
      : activeTab === "3"
      ? recipes3Data
      : recipes1Data;

  return (
    <section className={styles["recipe"]}>
      <div className={styles["recipe__container"]}>
        <h2 className={styles["recipe__title"]}>{t("Recipes")}</h2>

        <div className={styles["tabs__container"]}>
          {tabs.map((tab) => (
            <button
              key={tab._id}
              className={`${styles["tabs"]} ${
                activeTab === tab._id ? styles["active"] : ""
              }`}
              onClick={() => {
                setActiveTab(tab._id);
              }}
            >
              <Icon
                icon={tab.icon}
                color={activeTab === tab._id ? "var(--primary)" : "black"}
              />
              {t(`${tab.label}`)}
            </button>
          ))}
        </div>

        <div className={styles["recipes__container"]}>
          <Splide
            options={{
              // direction: locale === "ar" ? "rtl" : "ltr",
              arrows: false,
              rewind: true,
              type: "loop",
              autoplay: true,
              perPage: 5,
              mediaQuery: "max",
              pagination: false,
              pauseOnHover: true,
              pauseOnFocus: true,
              padding: "5rem",
              // focus: "center",
              breakpoints: {
                320: {
                  perPage: 1,
                },
                576: {
                  perPage: 1,
                },
                768: {
                  perPage: 2,
                },
                992: {
                  perPage: 3,
                },
                1200: {
                  perPage: 4,
                },
              },
            }}
          >
            {recipeList.map((recipe) => (
              <SplideSlide key={recipe._id}>
                <div className={styles["recipe__card"]}>
                  <div className={styles["recipe__header"]}>
                    <div className={styles["recipe__img"]}>
                      <img src={recipe.imgUrl} alt="" />
                    </div>
                    <p className={styles["recipe__name"]}>{recipe.name}</p>
                  </div>

                  <div className={styles["recipe__footer"]}>
                    <Link href={"/recipe/" + recipe.slug}>
                      {t("ViewRecipe")}
                    </Link>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        <Link href={"/recipe"} className={styles["show__all"]}>
          <span>{t("Allrecipes")}</span>
        </Link>
      </div>
    </section>
  );
}

export default Recipe;
