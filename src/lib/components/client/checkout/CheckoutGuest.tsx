import { IAreaPost } from "@/lib/@types/Area";
import { ICityPost } from "@/lib/@types/City";
import { ICountryPost } from "@/lib/@types/Country";
import React, { useEffect, useState } from "react";
import styles from "./CheckoutGuest.module.scss";
import { OrderFormGuest } from "@/lib/@types/Order";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import Link from "next/link";
import CheckCouponForm from "./CheckCouponForm";
import { ICouponPost } from "@/lib/@types/Coupon";
import CheckoutSummary from "./CheckoutSummary";
import apiPaths from "@/lib/@types/enum/apiPaths";

const paymentMethodArr = [
  { label: "Cash on Delivery", value: "cash" },
  { label: "Online Payment", value: "card" },
];

function CheckoutGuest({
  props,
  setSuccessMsg,
  setErrorMsg,
  setOrderId,
}: {
  props: {
    countryList: ICountryPost[];
    cityList: ICityPost[];
    areaList: IAreaPost[];
  };
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setOrderId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { locale, defaultLocale } = useRouter();
  const { t } = useTranslation();
  const [hasCoupon, setHasCoupon] = useState(false);
  const [coupon, setCoupon] = useState<ICouponPost | undefined>();
  const { setShoppingCart } = useClientStore();
  const [filteredBillingCityList, setFilteredBillingCityList] = useState<
    ICityPost[]
  >([]);
  const [filteredBillingAreaList, setFilteredBillingAreaList] = useState<
    IAreaPost[]
  >([]);
  const [selectedBillingCountry, setSelectedBillingCountry] =
    useState<ICountryPost | null>(null);
  const [selectedBillingCity, setSelectedBillingCity] =
    useState<ICityPost | null>(null);
  const [selectedBillingArea, setSelectedBillingArea] =
    useState<IAreaPost | null>(null);

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
    watch,
    unregister,
    formState: { errors },
  } = useForm<OrderFormGuest>({
    defaultValues: { active: true },
  });

  useEffect(() => {
    // billing
    register("billingCountry", {
      required: {
        value: true,
        message: "Country is Required",
      },
    });

    if (props.countryList.length === 1) {
      setSelectedBillingCountry(props.countryList[0]);
      setValue("billingCountry", props.countryList[0]._id);
      setFilteredBillingCityList(
        props.cityList.filter((x) => props.countryList[0]._id === x.country)
      );
    }

    register("billingCity", {
      required: {
        value: true,
        message: "City is Required",
      },
    });

    register("billingArea", {
      required: {
        value: true,
        message: "Area is Required",
      },
    });
  }, []);

  useEffect(() => {
    // shipping
    if (watch("shipToAnotherAddress")) {
      register("country", {
        required: {
          value: watch("shipToAnotherAddress") === true,
          message: "Country is Required",
        },
      });

      if (props.countryList.length === 1) {
        setSelectedCountry(props.countryList[0]);
        setValue("country", props.countryList[0]._id);
        setFilteredCityList(
          props.cityList.filter((x) => props.countryList[0]._id === x.country)
        );
      }

      register("city", {
        required: {
          value: watch("shipToAnotherAddress") === true,
          message: "City is Required",
        },
      });

      register("area", {
        required: {
          value: watch("shipToAnotherAddress") === true,
          message: "Area is Required",
        },
      });
    } else {
      unregister("country");
      unregister("city");
      unregister("area");
    }
  }, [watch("shipToAnotherAddress")]);

  const onSubmit: SubmitHandler<OrderFormGuest> = (values: OrderFormGuest) => {
    // console.log(values);

    if (values.paymentMethod === "card") return;

    const paramObj = { ...values };

    httpClient
      .post(apiPaths.orderGuest, paramObj)
      .then((res) => {
        // console.log(res);
        setShoppingCart(res.data.data.cart);
        setSuccessMsg(res.data.message || "success");
        setErrorMsg("");
        setOrderId(res.data.data.orderId);
      })
      .catch((err) => {
        setSuccessMsg("");
        setErrorMsg(err.response.data.message || "error");
        // console.log(err);
      });
  };

  return (
    <>
      <div className={styles.checkout__address}>
        <h2
          style={{
            marginBottom: "0.5rem",
          }}
        >
          {t("Checkout")}
        </h2>
        <h3 className="checkout__title" style={{ fontWeight: "500" }}>
          {t("Billing Address")}
        </h3>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingFirstName", {
                  required: {
                    value: true,
                    message: t("First name is required"),
                  },
                })}
                fullWidth
                label={t("First Name")}
                error={errors.billingFirstName !== undefined}
                helperText={errors.billingFirstName?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingLastName", {
                  required: {
                    value: true,
                    message: t("Last name is required"),
                  },
                })}
                fullWidth
                label={t("Last Name")}
                error={errors.billingLastName !== undefined}
                helperText={errors.billingLastName?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingEmail", {
                  required: { value: true, message: t("Email is required") },
                  pattern: {
                    value:
                      /^[\w\-]+([\.\-\_][a-z0-9]+)*(@[\w\-]+)(\.[a-z]+)+$/gi,
                    message: t("Invalid Email"),
                  },
                })}
                fullWidth
                label={t("Email")}
                error={errors.billingEmail !== undefined}
                helperText={errors.billingEmail?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                type="number"
                {...register("billingPhoneNumber", {
                  required: {
                    value: true,
                    message: t("Phone Number is required"),
                  },
                  pattern: {
                    value: /^01[0125][0-9]{8}$/gm,
                    message: t("Invalid Phone Number"),
                  },
                })}
                fullWidth
                label={t("Phone Number")}
                error={errors.billingPhoneNumber !== undefined}
                helperText={errors.billingPhoneNumber?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <Autocomplete
                value={selectedBillingCountry}
                disabled={props.countryList.length === 1}
                onChange={(_, val) => {
                  setSelectedBillingCountry(val);
                  setValue("billingCountry", val?._id);
                  trigger("billingCountry");

                  setFilteredBillingCityList(
                    val && val._id
                      ? props.cityList.filter((x) => x.country === val._id)
                      : []
                  );
                  setSelectedBillingCity(null);
                  trigger("billingCity");

                  setFilteredBillingAreaList([]);
                  setSelectedBillingArea(null);
                  trigger("billingArea");
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
                    error={errors.billingCountry !== undefined}
                    helperText={errors.billingCountry?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <Autocomplete
                value={selectedBillingCity}
                onChange={(_, val) => {
                  setSelectedBillingCity(val);
                  setValue("billingCity", val?._id);
                  trigger("billingCity");

                  setFilteredBillingAreaList(
                    val && val._id
                      ? props.areaList.filter((x) => x.city === val._id)
                      : []
                  );
                  setSelectedBillingArea(null);
                  trigger("billingCity");
                }}
                autoHighlight
                options={filteredBillingCityList}
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
                    error={errors.billingCity !== undefined}
                    helperText={errors.billingCity?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <Autocomplete
                value={selectedBillingArea}
                onChange={(_, val) => {
                  setSelectedBillingArea(val);
                  setValue("billingArea", val?._id);
                  trigger("billingArea");
                }}
                autoHighlight
                options={filteredBillingAreaList}
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
                    error={errors.billingArea !== undefined}
                    helperText={errors.billingArea?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingStreetName", {
                  required: {
                    value: true,
                    message: t("Street Name is required"),
                  },
                })}
                fullWidth
                label={t("Street Name")}
                error={errors.billingStreetName !== undefined}
                helperText={errors.billingStreetName?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingBuildingNumber", {
                  required: {
                    value: true,
                    message: t("Building number is Required"),
                  },
                })}
                fullWidth
                label={t("Building Number")}
                error={errors.billingBuildingNumber !== undefined}
                helperText={errors.billingBuildingNumber?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingFloorNumber", {
                  required: {
                    value: true,
                    message: t("Floor / Apartment No is Required"),
                  },
                })}
                fullWidth
                label={t("Floor / Apartment Number")}
                error={errors.billingFloorNumber !== undefined}
                helperText={errors.billingFloorNumber?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <TextField
                {...register("billingLandMark")}
                multiline
                fullWidth
                label={t("Landmark")}
                error={errors.billingLandMark !== undefined}
                helperText={errors.billingLandMark?.message}
              />
            </div>
          </div>

          <div className="input__area">
            <div className="input__field">
              <Controller
                name="shipToAnotherAddress"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox {...field} checked={field.value === true} />
                    }
                    label={t("Ship to another address")}
                  />
                )}
              />
            </div>
            {errors.shipToAnotherAddress && (
              <small className="error__text">
                {errors.shipToAnotherAddress.message}
              </small>
            )}
          </div>

          {watch("shipToAnotherAddress") && (
            <>
              <h2
                className="checkout__title"
                style={{ fontWeight: "500", marginBottom: "1rem" }}
              >
                {t("Billing Address")}
              </h2>
              <div className="input__area">
                <div className="input__field">
                  <TextField
                    {...register("firstName", {
                      required: {
                        value: watch("shipToAnotherAddress") === true,
                        message: t("First name is required"),
                      },
                    })}
                    fullWidth
                    label={t("First Name")}
                    error={errors.firstName !== undefined}
                    helperText={errors.firstName?.message}
                  />
                </div>
              </div>

              <div className="input__area">
                <div className="input__field">
                  <TextField
                    {...register("lastName", {
                      required: {
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Last name is required"),
                      },
                    })}
                    fullWidth
                    label={t("Last Name")}
                    error={errors.lastName !== undefined}
                    helperText={errors.lastName?.message}
                  />
                </div>
              </div>

              <div className="input__area">
                <div className="input__field">
                  <TextField
                    {...register("email", {
                      required: {
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Email is required"),
                      },
                      pattern: {
                        value:
                          /^[\w\-]+([\.\-\_][a-z0-9]+)*(@[\w\-]+)(\.[a-z]+)+$/gi,
                        message: t("Invalid Email"),
                      },
                    })}
                    fullWidth
                    label={t("Email")}
                    error={errors.email !== undefined}
                    helperText={errors.email?.message}
                  />
                </div>
              </div>

              <div className="input__area">
                <div className="input__field">
                  <TextField
                    type="number"
                    {...register("phoneNumber", {
                      required: {
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Phone Number is required"),
                      },
                      pattern: {
                        value: /^01[0125][0-9]{8}$/gm,
                        message: t("Invalid Phone Number"),
                      },
                    })}
                    fullWidth
                    label={t("Phone Number")}
                    error={errors.phoneNumber !== undefined}
                    helperText={errors.phoneNumber?.message}
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
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Street Name is required"),
                      },
                    })}
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
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Building number is Required"),
                      },
                    })}
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
                        value: watch("shipToAnotherAddress") === true,
                        message: t("Floor / Apartment No is Required"),
                      },
                    })}
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
                    {...register("landMark")}
                    multiline
                    fullWidth
                    label={t("Landmark")}
                    error={errors.landMark !== undefined}
                    helperText={errors.landMark?.message}
                  />
                </div>
              </div>
            </>
          )}

          <div className="input__area" style={{ marginTop: "1rem" }}>
            <h2>{t("Payment Method")}</h2>
            <div className="input__field">
              <RadioGroup name="type">
                {paymentMethodArr.map(({ label, value }) => (
                  <Controller
                    key={value}
                    name="paymentMethod"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t("Payment method is required"),
                      },
                    }}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Radio
                            {...field}
                            value={value}
                            checked={value === field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              trigger("paymentMethod");
                            }}
                          />
                        }
                        label={t(label)}
                      />
                    )}
                  />
                ))}
              </RadioGroup>
            </div>
            {errors.paymentMethod && (
              <small className="error__text">
                {errors.paymentMethod.message}
              </small>
            )}
          </div>

          {watch("paymentMethod") === "card" && (
            <div className="signin__container">
              <h3 style={{ marginBottom: "1rem", fontWeight: "400" }}>
                {t("You Must Login in order to pay online")}
              </h3>
              <div
                className="action__container"
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Link
                  href={"/register"}
                  style={{ marginBottom: "1rem", borderRadius: "0" }}
                  className="btn__contained primary"
                >
                  {t("Create new Account")}
                </Link>
                <Link
                  href={"/login"}
                  style={{ marginBottom: "1rem", borderRadius: "0" }}
                  className="btn__contained primary"
                >
                  {t("Log In")}
                </Link>
              </div>
            </div>
          )}

          {watch("paymentMethod") &&
            (watch("billingArea") ||
              (watch("shipToAnotherAddress") && watch("area"))) && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasCoupon}
                      onChange={(_, checked) => {
                        setHasCoupon(checked);
                      }}
                    />
                  }
                  label={t("I have coupon")}
                />
                {hasCoupon && (
                  <CheckCouponForm
                    setCoupon={(val?: ICouponPost) => {
                      setCoupon(val);
                      setValue("coupon", val?._id);
                    }}
                  />
                )}
              </>
            )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              marginBlock: "1.5rem",
            }}
          >
            <Checkbox
              id="conditions"
              required
              style={{
                padding: "0",
                marginInlineEnd: "0.5rem",
                marginBlock: "0.5rem",
              }}
            />
            <label htmlFor="conditions">
              {t("I have read the terms and conditions")}
            </label>
            <Link
              style={{
                color: "#ea6506",
                fontWeight: "500",
                marginInlineStart: "0.3rem",
                textDecoration: "underline",
              }}
              href="/terms-conditions"
              target="_blank"
            >
              {t("Read terms and conditions")}
            </Link>
          </div>

          <button
            className="btn__contained primary"
            disabled={watch("paymentMethod") === "card"}
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              borderRadius: "0",
              marginBottom: "2rem",
              fontSize: "1rem",
            }}
          >
            {t("Confirm Order")}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <Link
            className="btn__text primary"
            style={{
              border: "1px solid #ea6506",
              width: "100%",
              borderRadius: "0",
            }}
            href={"/cart"}
          >
            {t("Back to cart")}
          </Link>
        </div>
      </div>

      <CheckoutSummary
        coupon={coupon}
        shippingValue={
          watch("shipToAnotherAddress")
            ? selectedArea?.shippingPrice
            : selectedBillingArea?.shippingPrice
        }
      />
    </>
  );
}

export default CheckoutGuest;
