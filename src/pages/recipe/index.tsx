import React, { useState } from "react";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "../../styles/client/Recipe.module.scss";
import Pagination from "@mui/material/Pagination";
import { useTranslation } from "next-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { ButtonBase } from "@mui/material";
import { IRecipeGet } from "@/lib/@types/Recipe";
import Link from "next/link";

interface IRecipesProps extends ITranslate {
  recipeList: IRecipeGet[];
  search: any;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  let props: IRecipesProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    search: query,
    recipeList: [],
    totalItems: 0,
    itemsPerPage: 0,
    onPageChange: "",
  };

  try {
    const res = await httpClientSSR(req).get("/recipe");
    props.recipeList = await res.data.data;
  } catch (error) {
    props.recipeList = [];
  }

  return {
    props,
  };
};

function Recipe({ recipeList, itemsPerPage, onPageChange }: IRecipesProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { locale, defaultLocale } = useRouter();

  const [filteredData, setFilteredData] = useState<IRecipeGet[]>(recipeList);

  // Routes Tree On Page Top
  const { push, query, pathname } = useRouter();
  const pathSegments = pathname.split("/");
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name = segment === "" ? "Home" : segment;

    return {
      href,
      name,
    };
  });

  const [currentPage, setCurrentPage] = useState<number>(+(query.page ?? 1));

  const slicedData = filteredData.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    push(`/recipe?page=${pageNumber}`);

    setCurrentPage(pageNumber);
  };

  return (
    <section className={styles["recipes"]}>
      <div className={styles["recipe__container"]}>
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

        <div className={styles["recipes__gallery"]}>
          {slicedData.map((item) => (
            <div
              className="product__card__container"
              style={{ width: "200px", height: "280px" }}
            >
              <div className="product__card">
                <div key={item._id}>
                  <div className="product__img">
                    <img
                      src={"/api/static/images/recipe/" + item.image}
                      alt={item.slug}
                    />
                  </div>

                  <div className="product__details">
                    <h3 className="product__name">
                      {item?.titleList?.find((x) => x.lang === locale)?.value ||
                        item?.titleList?.find((x) => x.lang === defaultLocale)
                          ?.value ||
                        ""}
                    </h3>

                    <p className="product__desc">
                      {item.descriptionList?.find((x) => x.lang === locale)
                        ?.value ||
                        item.descriptionList?.find(
                          (x) => x.lang === defaultLocale
                        )?.value ||
                        ""}
                    </p>
                    <div className={"show__all"}>
                      <Link href={"/recipe/" + item.slug}>
                        {t(`View Recipe`)}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(filteredData.length / 20)}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </section>
  );
}

export default Recipe;
