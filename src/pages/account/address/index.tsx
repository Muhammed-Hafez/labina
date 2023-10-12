import httpClient from "@/lib/middleware/httpClient";
import { useClientStore } from "@/lib/store/clientStore";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "@/styles/client/account/address/Browse.module.scss";
import Link from "next/link";
import { Icon } from "@iconify/react";
import AddressCard from "@/lib/components/client/account/AddressCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import ITranslate from "@/lib/@types/interfaces/ITranslate";

interface IAddressProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IAddressProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function BrowseAddress(props: IAddressProps) {
  const [deletedItemId, setDeletedItemId] = useState("");
  const { addressList, setAddressList } = useClientStore();
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      try {
        // console.log(addressList);

        const res = await httpClient.get("/address");
        // console.log(res.data.data);

        setAddressList(res.data.data);
      } catch (error) {
        setAddressList([]);
      }
    };
    getData();
  }, []);

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

      <section className={styles["addresses__body"]}>
        <div className={styles["addresses__container"]}>
          <h2 className={styles["addresses__title"]}>{t("My Addresses")}</h2>

          <Link
            href={"/account/address/new"}
            className={styles["add__address__btn"]}
          >
            {t("Add Address")}
          </Link>

          {addressList && addressList.length > 0 ? (
            addressList.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                setDeletedItemId={setDeletedItemId}
              />
            ))
          ) : (
            <div className={styles["no__addresses"]}>
              <Icon
                icon="ic:baseline-warning-amber"
                className={styles["warning__icon"]}
              />
              <h4>{t("You have placed no addresses.")}</h4>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BrowseAddress;
