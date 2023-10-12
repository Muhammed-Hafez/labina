import { ICouponPost } from "@/lib/@types/Coupon";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import httpClient from "@/lib/middleware/httpClient";
import styles from "./CheckCouponForm.module.scss";
import { useTranslation } from "next-i18next";

function CheckCouponForm({
  setCoupon,
}: {
  setCoupon: (coupon?: ICouponPost) => void;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);

  useEffect(() => {
    return () => {
      setCoupon(undefined);
      setIsValidCoupon(false);
    };
  }, []);

  function handleCouponSubmit() {
    if (couponCode) {
      httpClient
        .post("/coupon/check", { coupon: couponCode })
        .then((res) => {
          setCoupon(res.data.data);
          setIsValidCoupon(true);
          setErrorMsg("");
        })
        .catch((err) => {
          // console.log(err);
          setCoupon(undefined);
          setIsValidCoupon(false);
          setErrorMsg(err.response.data.message);
        });
    } else {
    }
  }

  const { t } = useTranslation();

  return (
    <div className="input__area">
      <div className="input__field">
        <TextField
          className={errorMsg ? "error__input" : ""}
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
          }}
          disabled={isValidCoupon}
          label={t("Coupon")}
        />
        {isValidCoupon ? (
          <button
            type="button"
            onClick={() => {
              setCoupon(undefined);
              setErrorMsg("");
              setIsValidCoupon(false);
            }}
            className={`${styles["check__btn"]} ${styles["error"]}`}
          >
            <Icon icon="ic:baseline-delete-forever" width="32" />
          </button>
        ) : (
          <button
            type="button"
            className={styles["check__btn"]}
            onClick={handleCouponSubmit}
          >
            <Icon icon="material-symbols:check-small-rounded" width="36" />
          </button>
        )}
      </div>

      {errorMsg && <div className="error__text">{errorMsg}</div>}
    </div>
  );
}

export default CheckCouponForm;
