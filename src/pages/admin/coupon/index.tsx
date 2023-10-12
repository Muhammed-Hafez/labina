import { ICouponGet } from "@/lib/@types/Coupon";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import httpAdmin from "@/lib/middleware/httpAdmin";
import {
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";
import styles from "@/styles/admin/Bowse.module.scss";
import { useAdminStore } from "@/lib/store/adminStore";
import { useRouter } from "next/router";

interface ICouponProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICouponProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowseCoupon() {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [couponList, setCouponList] = useState<ICouponGet[]>([]);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID",  },
    { field: "code", headerName: `${t("Code")}` },
    {
      field: "isPercentage",
      headerName: `${t("Is Percentage")}`,
      type: "boolean",
    },
    { field: "value", headerName: `${t("Value")}` },
    { field: "maxDiscountValue", headerName: `${t("Max Discount Value")}` },
    { field: "minCartValue", headerName: `${t("Min Cart Value")}` },
    { field: "start", headerName: `${t("Start Date")}` },
    { field: "end", headerName: `${t("End Date")}` },
    { field: "type", headerName: `${t("Type")}` },
    {
      field: "active",
      headerName: `${t("Active")}`,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: `${t("Actions")}`,
      sortable: false,
      renderCell(params) {
        return (
          <>
            {allowedActions.includes("edit") && (
              <ButtonBase
                href={"/admin/coupon/" + params.row._id}
                LinkComponent={Link}
                className="icon__btn"
              >
                <Icon icon="material-symbols:edit" width="20" />
              </ButtonBase>
            )}

            {allowedActions.includes("delete") && (
              <ButtonBase
                onClick={() => {
                  setOpen(true);
                  setDeletedItemId(params.row._id);
                }}
                type="button"
                className="icon__btn"
              >
                <Icon
                  icon="ic:baseline-delete"
                  color="var(--error)"
                  width="20"
                />
              </ButtonBase>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    httpAdmin
      .get("/coupon/f")
      .then((res) => {
        setCouponList(res.data.data);
      })
      .catch((err) => {});
  }, []);

  function handleLangDelete() {
    if (allowedActions.includes("delete")) {
      httpAdmin
        .delete("/coupon/" + deletedItemId)
        .then((res) => {
          setCouponList(res.data.data);
        })
        .catch((err) => {
          // console.log(err)
        });
      handleClose();
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {allowedActions.includes("delete") && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-content"
        >
          <DialogTitle id="delete-modal-title">
            {t("Are you sure to delete this coupon?")}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Coupons`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/coupon/new"} className="btn__contained">
                {t(`Add Coupon`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={couponList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowseCoupon;
