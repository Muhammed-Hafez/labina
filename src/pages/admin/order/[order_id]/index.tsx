import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Edit.module.scss";
import { IOrderGet } from "@/lib/@types/Order";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { getAutocompleteLabel, orderStatus } from "@/lib/@types/stables";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

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

function ViewOrderDetails() {
  const { locale, defaultLocale } = useRouter();
  const [order, setOrder] = useState<IOrderGet>();
  const { push, query } = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"confirmed" | "rejected" | "">("");
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    {
      field: "titleList",
      headerName: `${t("Title")}`,
      description: `${t(
        "This column has Link value getter and is not sortable."
      )}`,
      width: 150,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${
          params.row.product.titleList?.find((x: ITitle) => x.lang === locale)
            ?.value || ""
        }`,
    },
    {
      field: "titleListDefault",
      headerName: `${t("Default Title")}`,
      description: `${t(
        "This column has Link value getter and is not sortable."
      )}`,
      width: 150,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${
          params.row.product.titleList?.find(
            (x: ITitle) => x.lang === defaultLocale
          )?.value || ""
        }`,
    },
    {
      field: "mainImage",
      headerName: `${t("Image")}`,
      sortable: false,
      renderCell(params) {
        return (
          <img
            src={"/api/static/images/product/" + params.row.product.mainImage}
            alt="product"
            height="50"
          />
        );
      },
    },
    {
      field: "quantity",
      headerName: `${t("Quantity")}`,
    },
    {
      field: "priceAfterDiscount",
      headerName: `${t("Net price")}`,
    },
    {
      field: "price",
      headerName: `${t("Price")}`,
    },
    {
      field: "couponValue",
      headerName: `${t("Coupon")}`,
    },
    {
      field: "promotionValue",
      headerName: `${t("Promotion")}`,
    },
    {
      field: "promotionCode",
      headerName: `${t("Promo code")}`,
    },
  ];

  useEffect(() => {
    const _id = query.order_id;
    httpAdmin
      .patch(apiPaths.order, { _id, status: "viewed" })
      .then((res) => {
        setOrder(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {});
  }, []);

  function updateOrderStatus() {
    const _id = query.order_id;
    if (!_id || !status) return;
    httpAdmin.patch(apiPaths.order, { _id, status }).finally(() => {
      push("/admin/order");
    });
  }

  const handleClose = () => {
    setOpen(false);
    setStatus("");
  };
  return (
    order && (
      <div className={`${styles["container"]} container`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h1>{t("View Order Details")}</h1>
          {order.status === "viewed" && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setStatus("confirmed");
                  setOpen(true);
                }}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setStatus("rejected");
                  setOpen(true);
                }}
              >
                Reject
              </Button>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-content"
              >
                <DialogTitle id="modal-title">
                  {t(
                    status === "confirmed"
                      ? "Confirm this order?"
                      : "Reject this order?"
                  )}
                </DialogTitle>

                <DialogActions>
                  <Button onClick={handleClose}>{t(`Cancel`)}</Button>
                  <Button
                    onClick={updateOrderStatus}
                    variant="contained"
                    color={status === "confirmed" ? "success" : "error"}
                  >
                    {t(status === "confirmed" ? "Confirm" : "Reject")}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
        <div
          style={{
            marginBlockEnd: "1rem",
            padding: "0.25rem",
            border: "2px solid #000",
          }}
        >
          <p>Order id: {order.orderId}</p>
          <p>Status: {order.status}</p>
          <p>
            Payment:{" "}
            {order.paymentMethod === "cash"
              ? "Cash on delivery"
              : "Paid online"}
          </p>
          <p>Coupon: {order.couponCode}</p>
          <p>
            Ordered at:{" "}
            {new Date(order.createdAt).toLocaleString("en", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p>
            Last update at:{" "}
            {new Date(order.updatedAt).toLocaleString("en", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {order.shipToAnotherAddress && (
          <>
            <h2>Billing details</h2>
            <div
              style={{
                marginBlockEnd: "1rem",
                padding: "0.25rem",
                border: "2px solid #000",
              }}
            >
              <p>
                to: {order.billingFirstName} {order.billingLastName}
              </p>
              <p>phone: {order.billingPhoneNumber}</p>
              <p>
                Address:
                {order.billingBuildingNumber}, {order.billingStreetName},{" "}
                {getAutocompleteLabel(
                  order.billingArea.titleList,
                  locale,
                  defaultLocale
                )}
                ,{" "}
                {getAutocompleteLabel(
                  order.billingCity.titleList,
                  locale,
                  defaultLocale
                )}
                ,{" "}
                {getAutocompleteLabel(
                  order.billingCountry.titleList,
                  locale,
                  defaultLocale
                )}
                ,{" "}
              </p>
              <p>Floor No: {order.billingFloorNumber}</p>
              {order.billingLandMark && (
                <p>landmark: {order.billingLandMark}</p>
              )}
            </div>
          </>
        )}

        <h2>Shipping details</h2>
        <div
          style={{
            marginBlockEnd: "1rem",
            padding: "0.25rem",
            border: "2px solid #000",
          }}
        >
          <p>
            To: {order.firstName} {order.lastName}
          </p>
          <p>phone: {order.phoneNumber}</p>
          <p>
            Address:
            {order.buildingNumber}, {order.streetName},{" "}
            {getAutocompleteLabel(order.area.titleList, locale, defaultLocale)},{" "}
            {getAutocompleteLabel(order.city.titleList, locale, defaultLocale)},{" "}
            {getAutocompleteLabel(
              order.country.titleList,
              locale,
              defaultLocale
            )}
            ,{" "}
          </p>
          <p>Floor: {order.floorNumber}</p>
          {order.landMark && <p>landmark: {order.landMark}</p>}
        </div>

        <h2>Summary</h2>
        <div
          style={{
            marginBlockEnd: "1rem",
            padding: "0.25rem",
            border: "2px solid #000",
          }}
        >
          <p>
            Sub total: {order.subTotal} {t("EGP")}
          </p>
          <p>
            Shipping fee: {order.shippingPrice} {t("EGP")}
          </p>
          {order.promotionTotalValue > 0 && (
            <p>
              promotions: -{order.promotionTotalValue} {t("EGP")}
            </p>
          )}
          {order.couponTotalValue > 0 && (
            <p>
              coupon: -{order.couponTotalValue} {t("EGP")}
            </p>
          )}
          <hr />
          <p>
            Total: {order.netTotal} {t("EGP")}
          </p>
        </div>

        <h2>Products</h2>
        <DataGrid
          className={styles["data__grid"]}
          rows={order.productList ?? []}
          getRowId={(row) => row._id}
          columns={columns}
          autoHeight
        />
      </div>
    )
  );
}

export default ViewOrderDetails;
