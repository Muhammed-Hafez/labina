import { ICategoryGet } from "@/lib/@types/Category";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import {
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { GridColDef, GridValueGetterParams, DataGrid } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";
import styles from "@/styles/admin/Bowse.module.scss";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { useAdminStore } from "@/lib/store/adminStore";

interface ICategoryProps extends ITranslate {
  categoryList: ICategoryGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICategoryProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    categoryList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/category");
    props.categoryList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function BrowseCategory(props: ICategoryProps) {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [categoryList, setCategoryList] = useState<ICategoryGet[]>(
    props.categoryList
  );
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID",  },
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
    {
      field: "titleList_parent",
      headerName: `${t("Parent")}`,
      description: `${t(
        "This column has a Link value getter and is not sortable."
      )}`,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${getAutocompleteLabel(
          params.row.parent?.titleList,
          locale,
          defaultLocale
        )}`,
    },
    { field: "slug", headerName: `${t("Slug")}` },
    {
      field: "image",
      headerName: `${t("Image")}`,
      sortable: false,
      renderCell(params) {
        return (
          <img
            src={"/api/static/images/category/" + params.row.image}
            alt="category"
            height="50"
          />
        );
      },
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
                href={"/admin/category/" + params.row._id}
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
        .delete("/category/" + deletedItemId)
        .then((res) => {
          setCategoryList(res.data.data);
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
            {t(`Are you sure to delete this category?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}

      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Categories`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/category/new"} className="btn__contained">
                {t(`Add Category`)}
              </Link>
            </div>
          )}
        </div>

        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={categoryList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowseCategory;
