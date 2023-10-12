import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ICountryGet } from "@/lib/@types/Country";
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

interface ICountryProps extends ITranslate {
  countryList: ICountryGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICountryProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    countryList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/country");
    props.countryList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function BrowseCountry(props: ICountryProps) {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [countryList, setCountryList] = useState<ICountryGet[]>(
    props.countryList
  );
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
    { field: "isoCode", headerName: `${t("Code")}` },
    { field: "phoneCode", headerName: `${t("Phone Code")}` },
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
                href={"/admin/country/" + params.row._id}
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
        .delete("/country/" + deletedItemId)
        .then((res) => {
          setCountryList(res.data.data);
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
            {t(`Are you sure to delete this country?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}
      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Countries`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/country/new"} className="btn__contained">
                {t(`Add Country`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={countryList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowseCountry;
