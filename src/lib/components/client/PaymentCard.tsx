import { IPaymentCardGet } from "@/lib/@types/Payment";
import { Icon } from "@iconify/react";
import React from "react";
import styles from "./PaymentCard.module.scss";
import { useTranslation } from "next-i18next";

function PaymentCard({
  card,
  setCardId,
  isDelete = true,
}: {
  card: IPaymentCardGet;
  isDelete?: boolean;
  setCardId?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { t } = useTranslation();

  // Display card type based on first four digits
  function getCardType(cardNumber: string): string {
    const firstFourDigits = cardNumber.slice(0, 4);
    const firstFourInt = parseInt(firstFourDigits);

    if (firstFourDigits.startsWith("4")) {
      return "Visa";
    }

    if (
      ["51", "52", "53", "54", "55"].some((prefix) =>
        firstFourDigits.startsWith(prefix)
      ) ||
      (firstFourInt >= 2221 && firstFourInt <= 2720)
    ) {
      return "MasterCard";
    }

    return "Unknown";
  }

  return (
    <div className={styles["payment__card"]}>
      <div>
        <div className={styles["card__number"]}>
          <p className={styles["card__number__title"]}>{t("Card Number:")}</p>

          <div className={styles["card__numbers"]}>
            <p>{card.cardPlaceholder}</p>
          </div>
        </div>

        <div className={styles["card__number"]}>
          <p className={styles["card__number__title"]}>{t("Card Type:")}</p>

          <div className={styles["card__numbers"]}>
            <p>{getCardType(card.cardPlaceholder)}</p>
          </div>
        </div>
      </div>

      {isDelete && (
        <div className="delete__container">
          <button
            onClick={() => {
              setCardId && setCardId(card._id);
            }}
            className="delete__btn"
          >
            <Icon
              icon="ic:baseline-delete"
              className={styles["delete__icon"]}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentCard;
