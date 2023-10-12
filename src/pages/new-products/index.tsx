import React, { useState } from "react";
import styles from "@/styles/client/NewProduct.module.scss";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IProductGet } from "@/lib/@types/Product";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import ProductCard from "@/lib/components/client/home/ProductCard";
import { ButtonBase } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Pagination from "@mui/material/Pagination";
import FilterDrawer from "@/lib/components/client/layout/FilterDrawer";
import apiPaths from "@/lib/@types/enum/apiPaths";

interface INewProductsProps extends ITranslate {
  newProductList: IProductGet[];
  totalItems: number;
  itemsPerPage: number;
  onPageChange: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: INewProductsProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    newProductList: [],
    totalItems: 0,
    itemsPerPage: 0,
    onPageChange: "",
  };

  try {
    const res = await httpClientSSR(req).get(apiPaths.newProductList);

    props.newProductList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function NewProduct({
  newProductList,
  itemsPerPage,
  onPageChange,
}: INewProductsProps) {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [filteredData, setFilteredData] =
    useState<IProductGet[]>(newProductList);
  // const [slicedData, setSlicedData] = useState<IProductGet[]>([]);

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
    push(`/new-products?page=${pageNumber}`);

    setCurrentPage(pageNumber);
  };

  return (
    <section className={styles["new__products"]}>
      <div className={styles["new__container"]}>
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
                  breadcrumb.name.slice(1).replaceAll("-", " ")}
              </Link>
            ))}
          </Breadcrumbs>
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
            data={newProductList}
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

export default NewProduct;
