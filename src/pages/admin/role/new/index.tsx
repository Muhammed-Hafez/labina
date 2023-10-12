import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RoleForm } from "@/lib/@types/Role";
import { Checkbox, TextField, FormControlLabel } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { GetServerSideProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { IPermissionGet } from "@/lib/@types/Permission";

type PermissionAction = "browse" | "add" | "edit" | "delete";

interface IPermissionActionObj {
  [key: string]: PermissionAction[];
}

interface IPermission {
  permission: string;
  actionList: PermissionAction[];
}

interface IRolesProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: IRolesProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function NewRole() {
  const { push } = useRouter();
  const { t } = useTranslation();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [permissionList, setPermissionList] = useState<IPermissionGet[]>([]);
  const [permissionObj, setPermissionObj] = useState<IPermissionActionObj>({});
  const [selectedPermissionList, setSelectedPermissionList] =
    useState<GridRowSelectionModel>([]);
  const [selectedPermissionObj, setSelectedPermissionObj] =
    useState<IPermissionActionObj>({});

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID" },
    { field: "name", headerName: `${t("Name")}` },
    { field: "pathname", headerName: `${t("Pathname")}` },
    {
      field: "active",
      headerName: `${t("Active")}`,
      type: "boolean",
    },
    {
      field: "browse",
      headerName: `${t("Browse")}`,
      sortable: false,
      renderCell(params) {
        const id = params.row._id;
        return (
          permissionObj[id] &&
          permissionObj[id].includes("browse") &&
          selectedPermissionObj[id] &&
          selectedPermissionList.includes(id) && (
            <Checkbox
              checked={selectedPermissionObj[params.row._id].includes("browse")}
              onChange={() => {
                setSelectedPermissionObj((prev) => {
                  prev[id] = prev[id].includes("browse")
                    ? prev[id].filter((x) => x !== "browse")
                    : [...prev[id], "browse"];

                  return { ...prev };
                });
              }}
            />
          )
        );
      },
    },
    {
      field: "add",
      headerName: `${t("Add")}`,
      sortable: false,
      renderCell(params) {
        const id = params.row._id;
        return (
          permissionObj[id] &&
          permissionObj[id].includes("add") &&
          selectedPermissionObj[id] &&
          selectedPermissionList.includes(id) && (
            <Checkbox
              checked={selectedPermissionObj[params.row._id].includes("add")}
              onChange={() => {
                setSelectedPermissionObj((prev) => {
                  prev[id] = prev[id].includes("add")
                    ? prev[id].filter((x) => x !== "add")
                    : [...prev[id], "add"];

                  return { ...prev };
                });
              }}
            />
          )
        );
      },
    },
    {
      field: "edit",
      headerName: `${t("Edit")}`,
      sortable: false,
      renderCell(params) {
        const id = params.row._id;
        return (
          permissionObj[id] &&
          permissionObj[id].includes("edit") &&
          selectedPermissionObj[id] &&
          selectedPermissionList.includes(id) && (
            <Checkbox
              checked={selectedPermissionObj[params.row._id].includes("edit")}
              onChange={() => {
                setSelectedPermissionObj((prev) => {
                  prev[id] = prev[id].includes("edit")
                    ? prev[id].filter((x) => x !== "edit")
                    : [...prev[id], "edit"];

                  return { ...prev };
                });
              }}
            />
          )
        );
      },
    },
    {
      field: "delete",
      headerName: `${t("Delete")}`,
      sortable: false,
      renderCell(params) {
        const id = params.row._id;
        return (
          permissionObj[id] &&
          permissionObj[id].includes("delete") &&
          selectedPermissionObj[id] &&
          selectedPermissionList.includes(id) && (
            <Checkbox
              checked={selectedPermissionObj[params.row._id].includes("delete")}
              onChange={() => {
                setSelectedPermissionObj((prev) => {
                  prev[id] = prev[id].includes("delete")
                    ? prev[id].filter((x) => x !== "delete")
                    : [...prev[id], "delete"];

                  return { ...prev };
                });
              }}
            />
          )
        );
      },
    },
  ];

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoleForm>({
    defaultValues: { active: true },
  });

  useEffect(() => {
    async function getData() {
      try {
        const res = await httpAdmin.get("/permission/role");
        const role = res.data.data.role;
        register("level", {
          min: {
            value: role.level + 1,
            message: "Level must be higher than" + " " + role.level,
          },
        });

        const permissionList = res.data.data.permissionList;

        const pList = [];
        const perObj: IPermissionActionObj = {};
        const selPerObj: IPermissionActionObj = {};
        for (const element of permissionList) {
          const ele = element;

          const perm: IPermission = role.permissionList.find(
            (x: any) => x.permission === ele._id
          );

          // if (role.is_block_list) {
          //   if (!perm || perm.actionList.length < 4) {
          //     pList.push(ele);
          //     perObj[ele._id] = [];
          //     selPerObj[ele._id] = [];

          //     if (!perm?.actionList.includes("browse"))
          //       perObj[ele._id].push("browse");

          //     if (!perm?.actionList.includes("add"))
          //       perObj[ele._id].push("add");

          //     if (!perm?.actionList.includes("edit"))
          //       perObj[ele._id].push("edit");

          //     if (!perm?.actionList.includes("delete"))
          //       perObj[ele._id].push("delete");
          //   }
          // } else {
          if (perm && perm.actionList.length > 0) {
            pList.push(ele);
            perObj[ele._id] = [];
            selPerObj[ele._id] = [];

            if (perm.actionList.includes("browse"))
              perObj[ele._id].push("browse");

            if (perm.actionList.includes("add")) perObj[ele._id].push("add");

            if (perm.actionList.includes("edit")) perObj[ele._id].push("edit");

            if (perm.actionList.includes("delete"))
              perObj[ele._id].push("delete");
          }
          // }
        }

        setPermissionList(pList);
        setPermissionObj(perObj);
        setSelectedPermissionObj(selPerObj);
      } catch (error) {}
    }

    getData();
  }, []);

  const onSubmit: SubmitHandler<RoleForm> = (values: RoleForm) => {
    const permissionList: IPermission[] = [];

    for (const element of selectedPermissionList) {
      const ele = element as string;
      if (selectedPermissionObj[ele].length > 0)
        permissionList.push({
          permission: ele,
          actionList: selectedPermissionObj[ele],
        });
    }

    console.log(values);
    console.log(permissionList);

    httpAdmin
      .post("/role", { ...values, permissionList })
      .then((res) => {
        push("/admin/role");
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <h1>{t("Add new role")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("name", {
                required: { value: true, message: "Role name is required" },
                pattern: {
                  value: /^[a-z]+(_[a-z]+)*$/i,
                  message:
                    "Only english letters ( separated by _ ) are allowed",
                },
              })}
              fullWidth
              label={t("Name")}
              error={errors.name !== undefined}
              helperText={errors.name?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              type="number"
              {...register("level", {
                required: {
                  value: true,
                  message: "Level is required",
                },
              })}
              fullWidth
              label={t("Level")}
              error={errors.level !== undefined}
              helperText={errors.level?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Controller
              name="active"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Active")}
                />
              )}
            />
          </div>
          {errors.active && (
            <small className="error__text">{errors.active.message}</small>
          )}
        </div>

        {/* <div className="input__area">
          <div className="input__field">
            <Controller
              name="is_block_list"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={field.value === true} />
                  }
                  label={t("Is Block List")}
                />
              )}
            />
          </div>
          {errors.is_block_list && (
            <small className="error__text">
              {errors.is_block_list.message}
            </small>
          )}
        </div> */}

        <div className="input__area">
          <h3>
            {t("Block all except the following selected permissions:")}

            {/* {t(
              watch("is_block_list") === true
                ? `${t("Allow all except the following selected permissions:")}`
                : `${t("Block all except the following selected permissions:")}`
            )}
            : */}
          </h3>
          <div className="input__field">
            <DataGrid
              className={styles["data__grid"]}
              rows={permissionList}
              getRowId={(row) => row._id}
              columns={columns}
              autoHeight
              checkboxSelection
              rowSelectionModel={selectedPermissionList}
              onRowSelectionModelChange={(val) => {
                setSelectedPermissionList(val);
              }}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={(val) => {
                setPaginationModel(val);
              }}
            />
          </div>
        </div>

        <button className="btn__contained primary" type="submit">
          {t("Add Role")}
        </button>
      </form>
    </div>
  );
}

export default NewRole;
