import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ICategoryGet } from "@/lib/@types/Category";
import { IProductGet } from "@/lib/@types/Product";
import httpClient, { httpClientSSR } from "@/lib/middleware/httpClient";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { useClientStore } from "@/lib/store/clientStore";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import styles from "@/styles/client/CategorySlug.module.scss";
import Pagination from "@mui/material/Pagination";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import FilterDrawer from "@/lib/components/client/layout/FilterDrawer";
import { Icon } from "@iconify/react";
import ProductCard from "@/lib/components/client/home/ProductCard";
import { ButtonBase } from "@mui/material";
import { t } from "i18next";
import apiPaths from "@/lib/@types/enum/apiPaths";

interface ICategoryProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: ICategoryProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function CategorySlug(props: ICategoryProps) {
  const { locale, defaultLocale, query, push } = useRouter();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { shoppingCart, setShoppingCart } = useClientStore();
  const [productList, setProductList] = useState<IProductGet[]>([]);
  const [category, setCategory] = useState<ICategoryGet | undefined>();
  const [activeTab, setActiveTab] = useState("");
  const [filteredData, setFilteredData] = useState<IProductGet[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(+(query.page ?? 1));

  const slicedData = filteredData?.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  useEffect(() => {
    httpClient
      .get(`${apiPaths.getCategoryBySlug}/${query.category_slug}`)
      .then((res) => {
        setCategory(res.data.data.category);
        setProductList(res.data.data.productList);
        setFilteredData(res.data.data.productList);
        console.log(res.data.data.productList);
      })
      .catch((error) => {});
  }, [query.category_slug]);

  function addToCart(id: string) {
    httpClient
      .put("/cart", { product: id, quantity: 1 })
      .then((res) => {
        console.log(res.data.data);
        setShoppingCart(res.data.data);
      })
      .catch((err) => {
        // console.log(err)
      });
  }

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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    push(`/new-products?page=${pageNumber}`);

    setCurrentPage(pageNumber);
  };

  const [isGridLayout, setIsGridLayout] = useState(true);

  const changeLayout = () => {
    setIsGridLayout((prevState) => !prevState);
  };

  return (
    <section className={styles["category"]}>
      <div className={styles["category__container"]}>
        <div
          style={{
            padding: "0.5rem 1rem",
            marginBlock: "1rem",
          }}
        >
          <Breadcrumbs dir="ltr" aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb) => (
              <Link href={breadcrumb.href} key={breadcrumb.name}>
                {breadcrumb.name.charAt(0).toUpperCase() +
                  breadcrumb.name.slice(1).replaceAll("-", " ")}
              </Link>
            ))}
          </Breadcrumbs>
        </div>

        <div className={styles["category__banner"]}>
          {(category?.parent?.image || category?.image) && (
            <div className={styles["category__banner__img"]}>
              <img
                src={
                  "/api/static/images/category/" +
                  (category.parent?.image ?? category.image)
                }
                alt="Category Image"
              />
            </div>
          )}

          {/* <h2>
            {getAutocompleteLabel(category?.titleList, locale, defaultLocale)}
          </h2> */}

          {category?.childList && (
            <div className={styles["tabs__container"]}>
              {category?.childList.map((tab) => (
                <button
                  key={tab._id}
                  className={`tabs ${activeTab === tab._id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab._id);
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#ea6506",
                      color: "#fff",
                      padding: "0.5rem 0.8rem",
                      borderRadius: "1rem",
                    }}
                  >
                    {getAutocompleteLabel(tab.titleList, locale, defaultLocale)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className={styles.products__container}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <FilterDrawer
            filterDrawerOpen={drawerOpen}
            setFilterDrawerOpen={setDrawerOpen}
            data={productList}
            setFilteredData={setFilteredData}
          />

          <div className={styles["products__gallery"]}>
            <div className={styles["filter__header"]}>
              <div className={styles["drawer__filter"]}>
                <ButtonBase
                  onClick={() => {
                    setDrawerOpen((prev) => !prev);
                  }}
                  className={`${styles["menu__icon"]} icon__btn`}
                >
                  <Icon
                    icon="ic:baseline-filter-list"
                    className={styles["header__main__iconify"]}
                  />
                </ButtonBase>

                <ButtonBase
                  className={`${styles["menu__icon"]} icon__btn`}
                  style={{ width: "18px", height: "18px" }}
                  onClick={changeLayout}
                >
                  <Icon
                    icon="simple-line-icons:grid"
                    className={styles["header__main__iconify"]}
                  />
                </ButtonBase>
              </div>

              <h2 className={styles["new__title"]}>{t("New Products")}</h2>
            </div>

            <ProductCard productList={slicedData} />

            {/* Pagination */}
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
        </div>
      </div>
    </section>
  );
}

export default CategorySlug;
