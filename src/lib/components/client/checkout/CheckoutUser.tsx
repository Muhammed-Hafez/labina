import React, { useEffect, useRef, useState } from "react";
import styles from "./CheckoutUser.module.scss";
import { useClientStore } from "@/lib/store/clientStore";
import { OrderForm } from "@/lib/@types/Order";
import httpClient from "@/lib/middleware/httpClient";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ICouponPost } from "@/lib/@types/Coupon";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import AddressCard from "../account/AddressCard";
import CheckCouponForm from "./CheckCouponForm";
import Link from "next/link";
import CheckoutSummary from "./CheckoutSummary";
import PaymentCard from "../PaymentCard";
import { useRouter } from "next/router";
import apiPaths from "@/lib/@types/enum/apiPaths";
import { InlineIcon } from "@iconify/react";
import { io } from "socket.io-client";
import environment from "@/lib/environment";
import socket from "@/lib/services/socket";
// import socket from "@/lib/services/socket";

const paymentMethodArr = [
  { label: "Cash on Delivery", value: "cash" },
  { label: "Online Payment", value: "card" },
];

function CheckoutUser({
  setSuccessMsg,
  setErrorMsg,
  setOrderId,
}: {
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setOrderId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { push } = useRouter();
  const authenticateDivRef = useRef<HTMLDivElement>(null!);
  const otpDivRef = useRef<HTMLDivElement>(null!);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const { t } = useTranslation();
  const [hasCoupon, setHasCoupon] = useState(false);
  const [coupon, setCoupon] = useState<ICouponPost | undefined>();
  const { addressList, cardList, userInfo, setShoppingCart, setAddressList } =
    useClientStore();
  const [deletedItemId, setDeletedItemId] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<OrderForm>();

  useEffect(() => {
    setValue("address", undefined);
  }, [watch("shipToAnotherAddress")]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await httpClient.get("/address");

        setAddressList(res.data.data);
      } catch (error) {
        setAddressList([]);
      }
    };
    getData();

    socket.connect();
    socket.on("payTokenCb", orderWithTokenCallback);

    return () => {
      socket.disconnect();
      socket.off("payTokenCb", orderWithTokenCallback);
    };
  }, []);

  function handleAddCard() {
    httpClient
      .post(apiPaths.addCardSession)
      .then((res) => {
        // @ts-ignore
        Checkout.configure({
          session: {
            id: res.data.data.sessionId,
          },
        });
        // @ts-ignore
        Checkout.showPaymentPage();
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  function handleLangDelete() {
    httpClient
      .delete("/address/" + deletedItemId)
      .then((res) => {
        setAddressList(res.data.data);
        handleClose();
      })
      .catch((err) => {
        // console.log(err)
      });
  }

  const handleClose = () => {
    setDeletedItemId("");
  };

  async function initPaymentAuth(token?: string) {
    if (!token) {
      setValue("orderId", "");
      setValue("referenceId", "");
      setValue("transactionId", "");
      return false;
    }

    try {
      const initResp = await httpClient.post(apiPaths.initAuthPayment, {
        token,
      });
      setValue("orderId", initResp.data.data.orderId);
      setValue("referenceId", initResp.data.data.referenceId);
      setValue("transactionId", initResp.data.data.transactionId);

      authenticateDivRef.current.innerHTML +=
        initResp.data.data.response.authentication.redirect.html;

      //@ts-ignore
      eval(document.getElementById("initiate-authentication-script")?.text);

      return {
        ...initResp.data.data,
      };
    } catch (error) {}
  }

  async function orderWithCash(values: OrderForm) {
    let paramObj = {
      ...values,
    };

    try {
      const orderResp = await httpClient.post(apiPaths.order, paramObj);

      setShoppingCart([]);
      push("/checkout/success/" + orderResp.data.data.token);
    } catch (error) {
      push("/checkout/error");
    }
  }

  async function orderWithCard(values: OrderForm) {
    let paramObj = {
      ...values,
    };

    try {
      const orderResp = await httpClient.post(apiPaths.order, paramObj);

      // @ts-ignore
      Checkout.configure({
        session: {
          id: orderResp.data.data.sessionId,
        },
      });
      // @ts-ignore
      Checkout.showPaymentPage();
    } catch (error) {}
  }

  async function orderWithToken(values: OrderForm) {
    let paramObj = {
      ...values,
    };

    try {
      const orderResp = await httpClient.post(apiPaths.order, paramObj);

      setIsOtpModalOpen(true);
      otpDivRef.current.innerHTML +=
        orderResp.data.data.response.authentication.redirect.html;

      // @ts-ignore
      eval(document.getElementById("authenticate-payer-script")?.text);

      // setShoppingCart(res.data.data.cart);
      // setSuccessMsg(res.data.message || "success");
      // setErrorMsg("");
      // setOrderId(res.data.data.orderId);
    } catch (err) {
      setSuccessMsg("");
      // setErrorMsg(err.response.data.message || "error");
      // console.log(err);
    }
  }

  function orderWithTokenCallback(status: number, token: string) {
    setIsOtpModalOpen(false);

    switch (status) {
      case 200:
        setShoppingCart([]);
        push(`/checkout/success/${token}`);
        break;
      default:
        push("/checkout/error");
    }
  }

  const onSubmit: SubmitHandler<OrderForm> = async (values: OrderForm) => {
    if (values.paymentMethod === "cash") {
      await orderWithCash(values);
    } else {
      if (values.isCardWithoutSave) {
        await orderWithCard(values);
      } else {
        await orderWithToken(values);
      }
    }
  };

  return (
    <>
      <Dialog
        open={deletedItemId !== ""}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-content"
      >
        <DialogTitle id="delete-modal-title">
          {t(`Are you sure to delete this Address?`)}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>{t(`Cancel`)}</Button>
          <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
        </DialogActions>
      </Dialog>

      <div className="checkout__address">
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

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {addressList && addressList.length > 0 ? (
            <>
              {/* <!-- Choose Address --> */}
              <div className="input__field">
                <RadioGroup
                  row
                  name="type"
                  style={{
                    marginBlock: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {addressList?.map((address) => (
                    <Controller
                      key={address._id}
                      name="billingAddress"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: t("Address is required"),
                        },
                      }}
                      render={({ field }) => (
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            maxWidth: "500px",
                          }}
                        >
                          <FormControlLabel
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                            control={
                              <Radio
                                {...field}
                                value={address._id}
                                checked={address._id === field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  trigger("billingAddress");
                                  setValue("address", undefined);
                                }}
                                style={{ flexBasis: "10%" }}
                              />
                            }
                            label={<></>}
                          />

                          <AddressCard
                            address={address}
                            setDeletedItemId={setDeletedItemId}
                          />
                        </div>
                      )}
                    />
                  ))}
                </RadioGroup>

                {addressList?.length < 1 && (
                  <Link
                    href="/account/address/new"
                    className="btn__contained primary"
                    style={{
                      marginBottom: "1.5rem",
                      width: "fit-content",
                      borderRadius: "0",
                    }}
                  >
                    {t("Add another address")}
                  </Link>
                )}
              </div>

              {watch("billingAddress") && (
                <div className="input__area">
                  <div className="input__field">
                    <Controller
                      name="shipToAnotherAddress"
                      control={control}
                      // rules={{ required: true }}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value === true}
                            />
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
              )}

              {watch("billingAddress") && watch("shipToAnotherAddress") && (
                <>
                  <h2 className="checkout__title" style={{ fontWeight: "500" }}>
                    {t("Billing Address")}
                  </h2>
                  <div className={"input__field"}>
                    {addressList.length > 1 ? (
                      <RadioGroup
                        row
                        name="type"
                        style={{
                          marginBlock: "2rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {addressList?.map(
                          (address) =>
                            watch("billingAddress") !== address._id && (
                              <Controller
                                key={address._id}
                                name="address"
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: t("Address is required"),
                                  },
                                }}
                                render={({ field }) => (
                                  <div style={{ display: "flex" }}>
                                    <FormControlLabel
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                      }}
                                      control={
                                        <Radio
                                          {...field}
                                          value={address._id}
                                          checked={address._id === field.value}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger("address");
                                          }}
                                          style={{ flexBasis: "10%" }}
                                        />
                                      }
                                      label={<></>}
                                    />

                                    <AddressCard
                                      address={address}
                                      setDeletedItemId={setDeletedItemId}
                                    />
                                  </div>
                                )}
                              />
                            )
                        )}
                      </RadioGroup>
                    ) : (
                      <>
                        <h2>{t("Please Add Address to proceed purchase")}</h2>
                        <br />
                        <Link
                          href={"/account/address/new"}
                          className="btn__contained primary"
                          style={{
                            marginBottom: "1.5rem",
                            width: "fit-content",
                            borderRadius: "0",
                          }}
                        >
                          {t("Add another address")}
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
              {/* <!-- Phone Number --> */}
              {/* <div className="input__area">
                <div className="input__field">
                  <TextField
                    type="number"
                    {...register("phoneNumber")}
                    fullWidth
                    label={t("Phone Number")}
                    error={errors.phoneNumber !== undefined}
                    helperText={errors.phoneNumber?.message}
                  />
                </div>
              </div> */}

              {watch("billingAddress") &&
                ((watch("shipToAnotherAddress") && watch("address")) ||
                  !watch("shipToAnotherAddress")) && (
                  <div
                    className="input__area"
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    <h2>{t("Payment Method")}</h2>
                    <div
                      className="input__field"
                      style={{ marginTop: "0.5rem" }}
                    >
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
                )}

              {/* <!-- Choose Card --> */}
              {watch("paymentMethod") === "card" && (
                <>
                  <div className="input__area">
                    <div className="input__field">
                      <Controller
                        name="isCardWithoutSave"
                        control={control}
                        // rules={{ required: true }}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value === true}
                              />
                            }
                            label={t("Pay without saving card")}
                          />
                        )}
                      />
                    </div>
                    {errors.isCardWithoutSave && (
                      <small className="error__text">
                        {errors.isCardWithoutSave.message}
                      </small>
                    )}
                  </div>
                  {!watch("isCardWithoutSave") && (
                    <>
                      {cardList && cardList.length > 0 ? (
                        <>
                          <div className="input__area">
                            <RadioGroup row name="type">
                              {cardList?.map((card) => (
                                <Controller
                                  key={card._id}
                                  name="paymentToken"
                                  control={control}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: t("Card is required"),
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FormControlLabel
                                      control={
                                        <Radio
                                          {...field}
                                          value={card._id}
                                          checked={card._id === field.value}
                                          onChange={(e) => {
                                            field.onChange(e);

                                            initPaymentAuth(card._id);

                                            trigger("paymentToken");
                                          }}
                                        />
                                      }
                                      label={
                                        <PaymentCard
                                          card={card}
                                          isDelete={false}
                                        />
                                      }
                                    />
                                  )}
                                />
                              ))}
                            </RadioGroup>
                            {errors.paymentToken && (
                              <div className="error__text">
                                {errors.paymentToken.message}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddCard}
                            className="btn__contained primary"
                            style={{
                              borderRadius: "0",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "1rem",
                              width: "fit-content",
                            }}
                          >
                            {t("Add Card")}
                          </button>
                        </>
                      ) : (
                        <div
                          className="input__area"
                          style={{ marginBottom: "1rem" }}
                        >
                          <br />
                          <h3 style={{ fontWeight: "400" }}>
                            {t("You didn't add any card to your account.")}
                          </h3>
                          <br />
                          <button
                            type="button"
                            onClick={handleAddCard}
                            className="btn__contained primary"
                            style={{
                              borderRadius: "0",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "1rem",
                            }}
                          >
                            {t("Add Card")}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {watch("billingAddress") &&
                ((watch("shipToAnotherAddress") && watch("address")) ||
                  !watch("shipToAnotherAddress")) &&
                watch("paymentMethod") === "card" &&
                !watch("isCardWithoutSave") &&
                watch("paymentToken") && (
                  <div className="input__area">
                    <div className="input__field">
                      <TextField
                        {...register("cvv", {
                          required: {
                            value: true,
                            message: t("CVV is required"),
                          },
                          pattern: {
                            value: /^[0-9]*$/gi,
                            message: t("Only numbers [0-9] allowed"),
                          },
                          minLength: {
                            value: 3,
                            message: t("CVV must be 3 numbers"),
                          },
                          maxLength: {
                            value: 3,
                            message: t("CVV must be  3 numbers"),
                          },
                        })}
                        fullWidth
                        label={t("CVV")}
                        error={errors.cvv !== undefined}
                        helperText={errors.cvv?.message}
                      />
                    </div>
                  </div>
                )}

              {watch("billingAddress") &&
                ((watch("shipToAnotherAddress") && watch("address")) ||
                  !watch("shipToAnotherAddress")) &&
                (watch("paymentMethod") === "cash" ||
                  (watch("paymentMethod") === "card" &&
                    (watch("isCardWithoutSave") ||
                      (!watch("isCardWithoutSave") &&
                        watch("paymentToken"))))) && (
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

              {watch("billingAddress") &&
                ((watch("shipToAnotherAddress") && watch("address")) ||
                  !watch("shipToAnotherAddress")) && (
                  <>
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

                    <div>
                      <button
                        className="btn__contained primary"
                        disabled={
                          watch("paymentMethod") === "card" &&
                          !watch("isCardWithoutSave") &&
                          !watch("paymentToken")
                        }
                        type="submit"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          borderRadius: "0",
                          fontSize: "1rem",
                        }}
                      >
                        {t("Confirm Order")}
                      </button>
                    </div>
                  </>
                )}
            </>
          ) : (
            <div className="input__area">
              <Link
                href={"/account/address/new"}
                className="btn__contained primary"
              >
                {t("Add Address")}
              </Link>
            </div>
          )}
        </form>

        {watch("billingAddress") &&
          ((watch("shipToAnotherAddress") && watch("address")) ||
            !watch("shipToAnotherAddress")) && (
            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
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
          )}

        <div ref={authenticateDivRef} hidden />

        <Modal
          open={isOtpModalOpen}
          onClose={() => {
            setIsOtpModalOpen(false);
            push("/cart");
          }}
          keepMounted
          aria-labelledby="modal-bank"
          // aria-describedby="modal-modal-description"
        >
          <div className={styles["modal__box"]}>
            <div className={styles["modal__header"]}>
              <h3 className="font-bold text-lg ml-2">OTP Bank</h3>
              {/* <IconButton
                className="btn"
                onClick={() => {
                  setIsOtpModalOpen(false);
                }}
              >
                <InlineIcon icon="ic:round-close" />
              </IconButton> */}
            </div>
            <div className={styles["modal__body"]} ref={otpDivRef} />
          </div>
        </Modal>
      </div>

      <CheckoutSummary
        coupon={coupon}
        shippingValue={
          addressList?.find((x) =>
            watch("shipToAnotherAddress")
              ? x._id === watch("address")
              : x._id === watch("billingAddress")
          )?.area.shippingPrice
        }
      />
    </>
  );
}

export default CheckoutUser;
