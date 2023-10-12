import React, { useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ISizeGet } from "@/lib/@types/Size";
import { useRouter } from "next/router";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAdminStore } from "@/lib/store/adminStore";

interface ISizeProps extends ITranslate {
  sizeList: ISizeGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ISizeProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    sizeList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/size");
    props.sizeList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function BrowseSize(props: ISizeProps) {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [sizeList, setSizeList] = useState<ISizeGet[]>(props.sizeList);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    { field: "_id", headerName: `${t("ID")}` },
    {
      field: "titleList",
      headerName: `${t("Title")}`,
      description: `${t(
        "This column has a Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${
          params.row.titleList?.find((x: ITitle) => x.lang === locale)?.value ||
          ""
        }`,
    },
    {
      field: "titleListDefault",
      headerName: `${t("Default Title")}`,
      description: `${t(
        "This column has a Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${
          params.row.titleList?.find((x: ITitle) => x.lang === defaultLocale)
            ?.value || ""
        }`,
    },
    { field: "code", headerName: `${t("Code")}` },
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
                href={"/admin/size/" + params.row._id}
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

  function handleLangDelete() {
    if (allowedActions.includes("delete")) {
      httpAdmin
        .delete("/size/" + deletedItemId)
        .then((res) => {
          setSizeList(res.data.data);
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
            {t(`Are you sure to delete this size?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Sizes`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/size/new"} className="btn__contained">
                {t(`Add Size`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={sizeList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowseSize;
