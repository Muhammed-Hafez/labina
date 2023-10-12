import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import PaymentCard from "@/lib/components/client/PaymentCard";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useClientStore } from "@/lib/store/clientStore";
import httpClient from "@/lib/middleware/httpClient";
import { Icon } from "@iconify/react";
import styles from "@/styles/client/account/cards/Browse.module.scss";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";

interface ICardsProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ICardsProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowseCards() {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { cardList, setCardList } = useClientStore();
  const [deletedItemId, setDeletedItemId] = useState("");

  useEffect(() => {
    httpClient
      .get("/payment/card")
      .then((res) => {
        setCardList(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
        setCardList([]);
      });
  }, []);

  function bankLoad() {
    console.log("asdasdasdasd");
  }

  function handleAddCard() {
    httpClient
      .post("/payment/session")
      .then((res) => {
        console.log("payment");
        console.log(res);

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
        console.log(err);
      });
  }

  function handleLangDelete() {
    httpClient
      .delete("/payment/card/" + deletedItemId)
      .then((res) => {
        setCardList(res.data.data);
        setDeletedItemId("");
      })
      .catch((err) => console.log(err));
  }

  const handleClose = () => {
    setDeletedItemId("");
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
          {t(`Are you sure to delete this Card?`)}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>{t(`Cancel`)}</Button>
          <Button onClick={handleLangDelete}>{t(`Yes`)}</Button>
        </DialogActions>
      </Dialog>

      <section className="cards__body">
        <div className={styles["cards__container"]}>
          <h2 className={styles["cards__title"]}>{t("My Cards")}</h2>

          {/* <Link
            href={"/account/cards/new"}
            className={styles["add__card__btn"]}
          >
            {t("Add Card")}
          </Link> */}

          <button className={styles["add__card__btn"]} onClick={handleAddCard}>
            {t("Add Card")}
          </button>

          {cardList && cardList.length > 0 ? (
            cardList.map((card) => (
              <PaymentCard
                key={card._id}
                card={card}
                setCardId={setDeletedItemId}
              />
            ))
          ) : (
            <div className={styles["no__cards"]}>
              <Icon
                icon="ic:baseline-warning-amber"
                className="warning__icon"
              />
              <h4>{t("You didn't add any card to your account.")}</h4>
            </div>
          )}
        </div>
      </section>

      {/* <Script
        src="https://qnbalahli.test.gateway.mastercard.com/checkout/version/61/checkout.js"
        data-error="errorCallback"
        data-cancel="cancelCallback"
      /> */}
    </>
  );
}

export default BrowseCards;
