// import React, { useEffect, useState } from "react";
// import styles from "@/styles/admin/Edit.module.scss";
// import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { RecipeForm, IRecipePost } from "@/lib/@types/Recipe";
// import {
//   Select,
//   Checkbox,
//   TextField,
//   MenuItem,
//   FormControlLabel,
// } from "@mui/material";
// import { useTranslation } from "next-i18next";
// import { useRouter } from "next/router";
// import langTable from "@/lib/static/langTable";
// import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
// import { GetServerSideProps } from "next";
// import ITranslate from "@/lib/@types/interfaces/ITranslate";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { ITitle } from "@/lib/@types/interfaces/ITitle";
// import UploadSinglePhoto from "@/lib/components/admin/UploadSinglePhoto";

// interface IRecipeProps extends ITranslate {
//   recipe?: IRecipePost;
// }

// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   locale,
//   req,
// }) => {
//   let props: IRecipeProps = {
//     ...(await serverSideTranslations(locale as string, ["common"])),
//     locale,
//   };

//   try {
//     const res = await httpAdminSSR(req).get("/recipe/" + query.recipe_id);
//     props.recipe = await res.data.data;
//   } catch (error) {}

//   return {
//     props,
//   };
// };

// function EditRecipe(props: IRecipeProps) {
//   const { locale, defaultLocale, locales, push } = useRouter();
//   const { t } = useTranslation();
//   const [selectedLanguage, setSelectedLanguage] = useState<string>(
//     locale ?? defaultLocale ?? "en"
//   );

//   useEffect(() => {
//     const title =
//       props.recipe?.titleList?.find((x) => x.lang === selectedLanguage)
//         ?.value ?? "";

//     setValue("title", title);

//     const description =
//       props.recipe?.descriptionList?.find((x) => x.lang === selectedLanguage)
//         ?.value ?? "";

//     setValue("description", description);
//   }, [selectedLanguage]);

//   const {
//     control,
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<RecipeForm>({ values: props.recipe });

//   const onSubmit: SubmitHandler<RecipeForm> = (values: RecipeForm) => {
//     console.log(values);
//     if (values.title === undefined || values.description === undefined) return;

//     let isTitleFound = false;
//     const titleList: ITitle[] = [...(props.recipe?.titleList ?? [])];
//     for (let i = 0; i < titleList.length; i++) {
//       const ele = titleList[i];
//       if (ele.lang === selectedLanguage) {
//         isTitleFound = true;
//         titleList[i].value = values.title;
//       }
//     }

//     if (isTitleFound === false) {
//       titleList.push({ lang: selectedLanguage, value: values.title });
//     }

//     let isDescriptionFound = false;
//     const descriptionList: ITitle[] = [
//       ...(props.recipe?.descriptionList ?? []),
//     ];
//     for (let i = 0; i < descriptionList.length; i++) {
//       const ele = descriptionList[i];
//       if (ele.lang === selectedLanguage) {
//         isDescriptionFound = true;
//         descriptionList[i].value = values.description;
//       }
//     }

//     if (isDescriptionFound === false) {
//       descriptionList.push({
//         lang: selectedLanguage,
//         value: values.description,
//       });
//     }

//     httpAdmin
//       .patch("/recipe", {
//         ...values,
//         titleList,
//         descriptionList,
//       })
//       .then((res) => {
//         push("/admin/recipe");
//       })
//       .catch((err) => {
//         // console.log(err)
//       });
//   };

//   return (
//     <div className={`${styles["container"]} container`}>
//       <Select
//         value={selectedLanguage}
//         style={{ width: "100%", marginBottom: "1.5rem" }}
//         onChange={(e) => {
//           setSelectedLanguage(e.target.value);
//         }}
//         label={t("Select language")}
//       >
//         {locales?.map((language) => (
//           <MenuItem key={language} value={language}>
//             {langTable[language]}
//           </MenuItem>
//         ))}
//       </Select>

//       <h1>{t("Edit Recipe")}</h1>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="input__area">
//           <div className="input__field">
//             <TextField
//               {...register("title", {
//                 required: {
//                   value: true,
//                   message: t("Recipe name is required"),
//                 },
//               })}
//               fullWidth
//               label={t("Name")}
//               error={errors.title !== undefined}
//               helperText={errors.title?.message}
//             />
//           </div>
//         </div>

//         <div className="input__area">
//           <div className="input__field">
//             <TextField
//               {...register("description", {
//                 required: {
//                   value: true,
//                   message: t("Recipe description is required"),
//                 },
//               })}
//               fullWidth
//               label={t("Description")}
//               error={errors.description !== undefined}
//               helperText={errors.description?.message}
//             />
//           </div>
//         </div>

//         <div className="input__area">
//           <div className="input__field">
//             <TextField
//               {...register("slug", {
//                 required: {
//                   value: true,
//                   message: t("Slug is required"),
//                 },
//               })}
//               fullWidth
//               label={t("Slug")}
//               error={errors.slug !== undefined}
//               helperText={errors.slug?.message}
//             />
//           </div>
//         </div>

//         <div className="input__area">
//           <div className="input__field">
//             <TextField
//               {...register("url", {
//                 required: {
//                   value: true,
//                   message: t("Url is required"),
//                 },
//               })}
//               fullWidth
//               label={t("Url")}
//               error={errors.url !== undefined}
//               helperText={errors.url?.message}
//             />
//           </div>
//         </div>

//         <div className="input__area">
//           <div className="input__field">
//             <Controller
//               name="active"
//               control={control}
//               // rules={{ required: true }}
//               render={({ field }) => (
//                 <FormControlLabel
//                   control={
//                     <Checkbox {...field} checked={field.value === true} />
//                   }
//                   label={t("Active")}
//                 />
//               )}
//             />
//           </div>
//         </div>

//         <div className="input__area">
//           <div className="input__field">
//             <Controller
//               name="showInHome"
//               control={control}
//               // rules={{ required: true }}
//               render={({ field }) => (
//                 <FormControlLabel
//                   control={
//                     <Checkbox {...field} checked={field.value === true} />
//                   }
//                   label={t("Show in homepage")}
//                 />
//               )}
//             />
//           </div>
//           {errors.showInHome && (
//             <small className="error__text">{errors.showInHome.message}</small>
//           )}
//         </div>

//         <div className="input__area">
//           <UploadSinglePhoto
//             location="recipe"
//             title="Upload recipe photo"
//             image={watch("image")}
//             setImage={(val: string | undefined) => {
//               setValue("image", val);
//             }}
//           />
//         </div>

//         <button className="btn__contained primary" type="submit">
//           {t("Update Recipe")}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditRecipe;
