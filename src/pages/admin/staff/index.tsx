import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
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
import { IAdminGet } from "@/lib/@types/Admin";
import { useAdminStore } from "@/lib/store/adminStore";

interface IAdminsProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IAdminsProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowseAdmins(props: IAdminsProps) {
  const [open, setOpen] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [adminList, setAdminList] = useState<IAdminGet[]>([]);
  const { t } = useTranslation();
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    { field: "firstName", headerName: `${t("First Name")}` },
    { field: "lastName", headerName: `${t("Last Name")}` },
    { field: "email", headerName: `${t("Email")}` },
    // {
    //   field: "is_block_list",
    //   headerName: `${t("Is Block List")}`,
    //   type: "boolean",
    // },
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
                href={"/admin/staff/" + params.row._id}
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
    async function getData() {
      try {
        const res = await httpAdmin.get("/admin");
        console.log(res);

        setAdminList(await res.data.data);
      } catch (error) {}
    }

    getData();
  }, []);

  function handleLangDelete() {
    if (allowedActions.includes("delete")) {
      httpAdmin
        .delete("/admin/" + deletedItemId)
        .then((res) => {
          setAdminList(res.data.data);
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
            {t(`Are you sure to delete this admin?`)}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>{t(`Cancel`)}</Button>
            <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
          </DialogActions>
        </Dialog>
      )}
      <div className={`${styles["container"]} container`}>
        <div className={styles["container__header"]}>
          <h1>{t(`Admins`)}</h1>

          {allowedActions.includes("add") && (
            <div className={styles["actions"]}>
              <Link href={"/admin/staff/new"} className="btn__contained">
                {t(`Add Admin`)}
              </Link>
            </div>
          )}
        </div>
        {allowedActions.includes("browse") && (
          <DataGrid
            className={styles["data__grid"]}
            rows={adminList}
            getRowId={(row) => row._id}
            columns={columns}
            autoHeight
          />
        )}
      </div>
    </>
  );
}

export default BrowseAdmins;
