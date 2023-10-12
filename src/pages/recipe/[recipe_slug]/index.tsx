import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "@/styles/client/ProductSlug.module.scss";
import style from "@/styles/client/RecipeSlug.module.scss";
import { useTranslation } from "next-i18next";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { IRecipeGet } from "@/lib/@types/Recipe";

interface IRecipeSlugProps extends ITranslate {
  recipe?: IRecipeGet;
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
}) => {
  let props: IRecipeSlugProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  try {
    const res = await httpClientSSR(req).get(
      "/recipe/slug/" + query.product_slug
    );
    props.recipe = await res.data.data.recipe;
  } catch (error) {
    console.log(error);
  }

  return {
    props,
  };
};

function ProductSlug(props: IRecipeSlugProps) {
  const { locale, defaultLocale } = useRouter();
  const { setShoppingCart } = useClientStore();
  const [productAmount, setProductAmount] = useState(1);
  const { t } = useTranslation();

  const mainOptions = {
    // direction: locale === "ar" ? "rtl" : ("ltr" as any),
    type: "loop",
    perPage: 1,
    perMove: 1,
    pagination: true,
    arrows: false,
  };

  const thumbsOptions = {
    // direction: locale === "ar" ? "rtl" : ("ltr" as any),
    type: "loop",
    rewind: true,
    gap: "1rem",
    arrows: false,
    perPage: 4,
    cover: true,
    focus: "center" as const,
    isNavigation: true,
    updateOnMove: true,
  };

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
    <>
      <section className={styles["product__section"]}>
        <div
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
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

        <div className={styles["product__container"]}>
          <iframe
            src={props.recipe?.url}
            // src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Fhajarafaeg%2Fvideos%2F560845278220786%2F&show_text=false&width=267&t=0"
            width="fit-content"
            height="500"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen={false}
          ></iframe>

          <div className={styles["product__details"]}>
            <div className={styles["product__info"]}>
              <h2>
                {getAutocompleteLabel(
                  props?.recipe?.titleList,
                  locale,
                  defaultLocale
                )}
                {props.recipe?.titleList?.find((x) => x.lang === locale)
                  ?.value ||
                  props.recipe?.titleList?.find((x) => x.lang === defaultLocale)
                    ?.value ||
                  ""}
              </h2>

              <p>
                {getAutocompleteLabel(
                  props?.recipe?.descriptionList,
                  locale,
                  defaultLocale
                )}
                {props.recipe?.descriptionList?.find((x) => x.lang === locale)
                  ?.value ||
                  props.recipe?.descriptionList?.find(
                    (x) => x.lang === defaultLocale
                  )?.value ||
                  ""}
              </p>
            </div>

            <div className={style.recipe__details}>
              <h4 className="recipe__details-title">Ingredients:</h4>

              <ul className="recipe__ingredients">
                <li>Honey</li>
                <li>Meat</li>
                <li>Tomato</li>
                <li>Onion</li>
                <li>Spices</li>
                <li>Oil</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductSlug;

{
  /* <iframe
  src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Fhajarafaeg%2Fvideos%2F560845278220786%2F&show_text=false&width=267&t=0"
  width="267"
  height="476"
  style="border:none;overflow:hidden"
  scrolling="no"
  frameborder="0"
  allowfullscreen="true"
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  allowFullScreen="true"
></iframe>; */
}
