import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CityForm } from "@/lib/@types/City";
import {
  Select,
  Checkbox,
  TextField,
  MenuItem,
  FormControlLabel,
  Autocomplete,
  Box,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import langTable from "@/lib/static/langTable";
import httpAdmin, { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import { ITitle } from "@/lib/@types/interfaces/ITitle";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { GetServerSideProps } from "next";
import { ICountryPost } from "@/lib/@types/Country";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

interface ICityProps extends ITranslate {
  countryList: ICountryPost[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: ICityProps = {
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

function NewCity(props: ICityProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );
  const [selectedCountry, setSelectedCountry] = useState<ICountryPost | null>(
    null
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CityForm>({
    defaultValues: { active: true },
  });

  useEffect(() => {
    register("country", {
      required: {
        value: true,
        message: t("Country is Required"),
      },
    });
  }, []);

  const onSubmit: SubmitHandler<CityForm> = (values: CityForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList: ITitle[] = [
      { lang: selectedLanguage, value: values.title },
    ];

    httpAdmin
      .post("/city", {
        ...values,
        titleList,
      })
      .then((res) => {
        push("/admin/city");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <div className={`${styles["container"]} container`}>
      <Select
        value={selectedLanguage}
        style={{ width: "100%", marginBottom: "1.5rem" }}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
        }}
        label={t("Select language")}
      >
        {locales?.map((language) => (
          <MenuItem key={language} value={language}>
            {langTable[language]}
          </MenuItem>
        ))}
      </Select>
      <h1>{t("Add new city")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: t("City name is required") },
              })}
              fullWidth
              label={t("Name")}
              error={errors.title !== undefined}
              helperText={errors.title?.message}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedCountry}
              onChange={(_, val) => {
                setSelectedCountry(val);
                setValue("country", val?._id);
                trigger("country");
              }}
              autoHighlight
              options={props.countryList}
              fullWidth
              getOptionLabel={(opt) =>
                getAutocompleteLabel(opt.titleList, locale, defaultLocale)
              }
              renderOption={(props, option) => (
                <Box key={option._id} component="li" {...props}>
                  {getAutocompleteLabel(
                    option.titleList,
                    locale,
                    defaultLocale
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Country")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.country !== undefined}
                  helperText={errors.country?.message}
                />
              )}
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

        <button className="btn__contained primary" type="submit">
          {t("Add City")}
        </button>
      </form>
    </div>
  );
}

export default NewCity;
