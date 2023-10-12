import { IPromotionGet } from "@/lib/@types/Promotion";
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

interface IPromotionProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IPromotionProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowsePromotion() {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [promotionList, setPromotionList] = useState<IPromotionGet[]>([]);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID",  },
    { field: "code", headerName: `${t("Code")}` },
    { field: "value", headerName: `${t("Value")}` },
    { field: "maxDiscountValue", headerName: `${t("Max Discount Value")}` },
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
                href={"/admin/promotion/" + params.row._id}
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
      .get("/promotion/f")
      .then((res) => {
        setPromotionList(res.data.data);
      })
      .catch((err) => {});
  }, []);

  function handleLangDelete() {
    if (allowedActions.includes("delete")) {
      httpAdmin
        .delete("/promotion/" + deletedItemId)
        .then((res) => {
          setPromotionList(res.data.data);
        })
        .catch((err) => {
          //  console.log(err)
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
            {t(`Are you sure to delete this promotion?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Promotions`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/promotion/new"} className="btn__contained">
                {t(`Add Promotion`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={promotionList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowsePromotion;
