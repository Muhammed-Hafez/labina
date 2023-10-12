import React, { useEffect, useState } from "react";
import { IProductGet } from "@/lib/@types/Product";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import httpClient, { httpClientSSR } from "@/lib/middleware/httpClient";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "../../../styles/client/account/Order.module.scss";
import Pagination from "@mui/material/Pagination";
import { useTranslation } from "next-i18next";
import ProductCard from "@/lib/components/client/home/ProductCard";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { ButtonBase } from "@mui/material";
import { Icon } from "@iconify/react";
import FilterDrawer from "@/lib/components/client/layout/FilterDrawer";
import { IRecipeGet } from "@/lib/@types/Recipe";
import Link from "next/link";
import { IOrderGet } from "@/lib/@types/Order";
import apiPaths from "@/lib/@types/enum/apiPaths";
import OrderCard from "@/lib/components/client/account/OrderCard";

interface IOrderProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IOrderProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const cardNumPerPage = 10;

function Order() {
  const { t } = useTranslation();
  const { locale, defaultLocale } = useRouter();
  const [orderList, setOrderList] = useState<IOrderGet[]>([]);

  const { push, query, pathname } = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(+(query.page ?? 1));

  const slicedData = orderList.slice(
    (currentPage - 1) * cardNumPerPage,
    currentPage * cardNumPerPage
  );

  useEffect(() => {
    httpClient
      .get(apiPaths.orderUser)
      .then((res) => {
        setOrderList(res.data.data);
      })
      .catch((err) => {});
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    push(`/order?page=${pageNumber}`);

    setCurrentPage(pageNumber);
  };

  return (
    <section className={styles["recipes"]}>
      <div className={styles["recipe__container"]}>
        {orderList.length > 0 ? (
          <div className={styles["recipes__gallery"]}>
            {slicedData.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div>No Orders Yet</div>
        )}
        {Math.ceil(orderList.length / cardNumPerPage) > 1 && (
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={Math.ceil(orderList.length / cardNumPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Order;
