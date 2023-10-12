import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
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
import { IHomepageGet } from "@/lib/@types/Homepage";

interface IHomepageProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IHomepageProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowseHomepage() {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [homepageList, setHomepageList] = useState<IHomepageGet[]>([]);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    {
      field: "titleList",
      headerName: `${t("App Title")}`,
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
      headerName: `${t("Default App Title")}`,
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
      field: "active",
      headerName: `${t("Active")}`,
      type: "boolean",
    },
    {
      field: "default",
      headerName: `${t("Default")}`,
      type: "boolean",
    },
    {
      field: "logo",
      headerName: `${t("Logo")}`,
      sortable: false,
      renderCell(params) {
        return (
          <img
            src={"/api/static/images/homepage/" + params.row.logo}
            alt="logo"
            height="50"
          />
        );
      },
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
                href={"/admin/homepage/" + params.row._id}
                LinkComponent={Link}
                className="icon__btn"
              >
                <Icon icon="material-symbols:edit" width="20" />
              </ButtonBase>
            )}

            {allowedActions.includes("delete") && !params.row.default && (
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
    async function getData() {
      try {
        const res = await httpAdmin.get("/homepage/list");
        setHomepageList(await res.data.data);
      } catch (error: any) {
        console.log("err");
      }
    }

    getData();
  }, []);

  function handleLangDelete() {
    if (allowedActions.includes("delete")) {
      httpAdmin
        .delete("/homepage/" + deletedItemId)
        .then((res) => {
          setHomepageList(res.data.data);
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
            {t(`Are you sure to delete this homepage?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Homepages`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/homepage/new"} className="btn__contained">
                {t(`Add Homepage`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={homepageList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </div>
  );
}

export default BrowseHomepage;
