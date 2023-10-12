import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IOrderGet } from "@/lib/@types/Order";
import { useAdminStore } from "@/lib/store/adminStore";

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

function BrowseOrder() {
  const [orderList, setOrderList] = useState<IOrderGet[]>([]);
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  useEffect(() => {
    async function getData() {
      try {
        const res = await httpAdmin.get("/order");
        setOrderList(await res.data.data);
      } catch (error: any) {
        console.log("err");
      }
    }

    getData();
  }, []);

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    { field: "status", headerName: `${t("Status")}` },
    {
      field: "createdAt",
      headerName: `${t("Ordered At")}`,
      minWidth: 180,
      valueFormatter(params) {
        return new Date(params.value).toLocaleString("en", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      },
    },
    {
      field: "updatedAt",
      headerName: `${t("Last Updated At")}`,
      minWidth: 180,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleString("en", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      field: "paymentMethod",
      headerName: `${t("Payment")}`,
      minWidth: 120,
      valueFormatter: (param) =>
        param.value === "card" ? "Online Payment" : "Cash on Delivery",
    },
    { field: "firstName", headerName: `${t("First Name")}` },
    { field: "lastName", headerName: `${t("Last Name")}` },
    {
      field: "active",
      headerName: `${t("Active")}`,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: `${t("Actions")}`,
      sortable: false,
      minWidth: 140,
      renderCell(params) {
        return (
          <Link
            href={"/admin/order/" + params.row._id}
            className="btn__contained"
          >
            <Icon icon="majesticons:checkbox-list-detail" width="20" />
            {t("Details")}
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    httpAdmin
      .get("/order/f")
      .then((res) => {
        console.log(res);

        setOrderList(res.data.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      {allowedActions.includes("browse") && (
        <div className={`${styles["container"]} container`}>
          <div className={styles["container__header"]}>
            <h1>{t(`Orders`)}</h1>
          </div>
          <DataGrid
            className={styles["data__grid"]}
            rows={orderList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        </div>
      )}
    </>
  );
}

export default BrowseOrder;
