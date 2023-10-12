import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AreaForm } from "@/lib/@types/Area";
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
import { ICityPost } from "@/lib/@types/City";
import { ICountryPost } from "@/lib/@types/Country";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface IAreaProps extends ITranslate {
  countryList: ICountryPost[];
  cityList: ICityPost[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IAreaProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    countryList: [],
    cityList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/country");
    props.countryList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpAdminSSR(req).get("/city");
    props.cityList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function NewArea(props: IAreaProps) {
  const { locale, defaultLocale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale ?? defaultLocale ?? "en"
  );
  const [filteredCityList, setFilteredCityList] = useState<ICityPost[]>(
    props.countryList.length === 1
      ? props.cityList.filter((x) => x.country === props.countryList[0]._id)
      : []
  );
  const [selectedCountry, setSelectedCountry] = useState<ICountryPost | null>(
    props.countryList.length === 1 ? props.countryList[0] : null
  );
  const [selectedCity, setSelectedCity] = useState<ICityPost | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AreaForm>({
    defaultValues: {
      active: true,
      country:
        props.countryList.length === 1 ? props.countryList[0]._id : undefined,
    },
  });

  useEffect(() => {
    register("country", {
      required: {
        value: true,
        message: t("Country is Required"),
      },
    });
    register("city", {
      required: {
        value: true,
        message: t("City is Required"),
      },
    });
  }, []);

  const onSubmit: SubmitHandler<AreaForm> = (values: AreaForm) => {
    console.log(values);
    if (!values.title) return;

    const titleList: ITitle[] = [
      { lang: selectedLanguage, value: values.title },
    ];

    httpAdmin
      .post("/area", {
        ...values,
        titleList,
      })
      .then((res) => {
        push("/admin/area");
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
      <h1>{t("Add new area")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("title", {
                required: { value: true, message: t("Area name is required") },
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
              disabled={props.countryList.length === 1}
              onChange={(_, val) => {
                setSelectedCountry(val);
                setValue("country", val?._id);
                trigger("country");

                setFilteredCityList(
                  val && val._id
                    ? props.cityList.filter((x) => x.country === val._id)
                    : []
                );
                setSelectedCity(null);
                trigger("city");
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
                  label={t(`Country`)}
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
            <Autocomplete
              value={selectedCity}
              onChange={(_, val) => {
                setSelectedCity(val);
                setValue("city", val?._id);
                trigger("city");
              }}
              autoHighlight
              options={filteredCityList}
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
                  label={t(`City`)}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                  error={errors.city !== undefined}
                  helperText={errors.city?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <TextField
              {...register("shippingPrice", {
                required: {
                  value: true,
                  message: `${t("Shipping price is required")}`,
                },
                min: {
                  value: 0,
                  message: `${"Min shipping value is 0"}`,
                },
              })}
              type="number"
              fullWidth
              label={t("Shipping Price")}
              error={errors.shippingPrice !== undefined}
              helperText={errors.shippingPrice?.message}
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
          {t("Add Area")}
        </button>
      </form>
    </div>
  );
}

export default NewArea;
