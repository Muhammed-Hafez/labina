import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/New.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddressForm } from "@/lib/@types/Address";
import { TextField, Autocomplete, Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { GetServerSideProps } from "next";
import { ICityPost } from "@/lib/@types/City";
import { ICountryPost } from "@/lib/@types/Country";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import httpClient, { httpClientSSR } from "@/lib/middleware/httpClient";
import { IAreaPost } from "@/lib/@types/Area";

interface IAddressProps extends ITranslate {
  countryList: ICountryPost[];
  cityList: ICityPost[];
  areaList: IAreaPost[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IAddressProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    countryList: [],
    cityList: [],
    areaList: [],
  };

  try {
    const res = await httpClientSSR(req).get("/country");
    props.countryList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpClientSSR(req).get("/city");
    props.cityList = await res.data.data;
  } catch (error) {}

  try {
    const res = await httpClientSSR(req).get("/area");
    props.areaList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

function NewAddress(props: IAddressProps) {
  const { locale, defaultLocale, query, push } = useRouter();
  const { t } = useTranslation();
  const [filteredCityList, setFilteredCityList] = useState<ICityPost[]>([]);
  const [filteredAreaList, setFilteredAreaList] = useState<IAreaPost[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountryPost | null>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<ICityPost | null>(null);
  const [selectedArea, setSelectedArea] = useState<IAreaPost | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AddressForm>({
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    httpClient
      .get("/address/f/" + query.address_id)
      .then((res) => {
        const foundAddress = res.data.data;
        setSelectedCountry(foundAddress.country);
        setSelectedCity(foundAddress.city);
        setSelectedArea(foundAddress.area);
        setFilteredCityList(
          props.cityList.filter((x) => x.country === foundAddress.country._id)
        );
        setFilteredAreaList(
          props.areaList.filter((x) => x.city === foundAddress.city._id)
        );

        reset({
          ...foundAddress,
          country: foundAddress.country._id,
          city: foundAddress.city._id,
          area: foundAddress.area._id,
        });
      })
      .catch((err) => {});
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
    register("area", {
      required: {
        value: true,
        message: t("Area is Required"),
      },
    });
  }, []);

  const onSubmit: SubmitHandler<AddressForm> = (values: AddressForm) => {
    httpClient
      .patch("/address", values)
      .then((res) => {
        push("/account/address");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <div
      className={styles["new__address"]}
      style={{
        maxWidth: "1000px",
        marginInline: "auto",
        paddingInline: "2rem",
        paddingTop: "2rem",
      }}
    >
      <div className={styles["new__address__container"]}>
        <h3 className={styles["new__address__title"]}>{t("Edit Address")}</h3>

        <div className={styles["new__address__form"]}>
          <form onSubmit={handleSubmit(onSubmit)}>
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

                    setFilteredAreaList([]);
                    setSelectedArea(null);
                    trigger("area");
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

                    setFilteredAreaList(
                      val && val._id
                        ? props.areaList.filter((x) => x.city === val._id)
                        : []
                    );
                    setSelectedArea(null);
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
                <Autocomplete
                  value={selectedArea}
                  onChange={(_, val) => {
                    setSelectedArea(val);
                    setValue("area", val?._id);
                    trigger("area");
                  }}
                  autoHighlight
                  options={filteredAreaList}
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
                      label={t(`Area`)}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill from browser
                      }}
                      error={errors.area !== undefined}
                      helperText={errors.area?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("streetName", {
                    required: {
                      value: true,
                      message: t("Street Name is required"),
                    },
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label={t("Street Name")}
                  error={errors.streetName !== undefined}
                  helperText={errors.streetName?.message}
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("buildingNumber", {
                    required: {
                      value: true,
                      message: t("Building number is Required"),
                    },
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label={t("Building Number")}
                  error={errors.buildingNumber !== undefined}
                  helperText={errors.buildingNumber?.message}
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("floorNumber", {
                    required: {
                      value: true,
                      message: t("Floor / Apartment No is Required"),
                    },
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label={t("Floor / Apartment Number")}
                  error={errors.floorNumber !== undefined}
                  helperText={errors.floorNumber?.message}
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: t("Phone Number is Required"),
                    },
                    pattern: {
                      value: /^01[0125][0-9]{8}$/gm,
                      message: t("Invalid Phone Number"),
                    },
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label={t("Phone Number")}
                  error={errors.phoneNumber !== undefined}
                  helperText={errors.phoneNumber?.message}
                />
              </div>
            </div>

            <div className="input__area">
              <div className="input__field">
                <TextField
                  {...register("landMark")}
                  multiline
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label={t("Landmark")}
                  error={errors.landMark !== undefined}
                  helperText={errors.landMark?.message}
                />
              </div>
            </div>

            <button className="btn__contained primary" type="submit">
              {t("Update Address")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewAddress;
