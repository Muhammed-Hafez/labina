import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IAreaGet } from "@/lib/@types/Area";
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
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAdminStore } from "@/lib/store/adminStore";

interface IAreaProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  },
});

function BrowseArea() {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [areaList, setAreaList] = useState<IAreaGet[]>([]);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await httpAdmin.get("/area/f");
        setAreaList(await res.data.data);
      } catch (error) {}
    }

    getData();
  }, []);

  const allowedActions =
    useAdminStore().adminInfo?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    {
      field: "titleList",
      headerName: `${t("Title")}`,
      description: `${t(
        "This column has Link value getter and is not sortable."
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
        "This column has Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${
          params.row.titleList?.find((x: ITitle) => x.lang === defaultLocale)
            ?.value || ""
        }`,
    },
    {
      field: "city",
      headerName: `${t("City")}`,
      description: `${t(
        "This column has Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${getAutocompleteLabel(
          params.row.city.titleList,
          locale,
          defaultLocale
        )}`,
    },
    {
      field: "country",
      headerName: `${t("Country")}`,
      description: `${t(
        "This column has Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${getAutocompleteLabel(
          params.row.country.titleList,
          locale,
          defaultLocale
        )}`,
    },
    {
      field: "shippingPrice",
      headerName: `${t("Shipping Price")}`,
    },
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
                href={"/admin/area/" + params.row._id}
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
        .delete("/area/" + deletedItemId)
        .then((res) => {
          setAreaList(res.data.data);
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
    <div>
      {allowedActions.includes("delete") && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-content"
        >
          <DialogTitle id="delete-modal-title">
            {t(`Are you sure to delete this area?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Areas`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/area/new"} className="btn__contained">
                {t(`Add Area`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={areaList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </div>
  );
}

export default BrowseArea;
