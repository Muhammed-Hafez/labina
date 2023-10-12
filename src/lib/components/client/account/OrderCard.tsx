import { IOrderGet } from "@/lib/@types/Order";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "./OrderCard.module.scss";
import { useTranslation } from "next-i18next";

function OrderCard({ order }: { order: IOrderGet }) {
  const { locale, defaultLocale } = useRouter();
  const { t } = useTranslation();

  return (
    <div className={styles["order__book"]}>
      <div className={styles["order__text"]}>
        <p className="country">
          {t("Location")}:{" "}
          <span>
            {order.country?.titleList?.find((x) => x.lang === locale)?.value ||
              order.country?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
          ,{" "}
          <span>
            {order.city?.titleList?.find((x) => x.lang === locale)?.value ||
              order.city?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
          ,{" "}
          <span>
            {order.area?.titleList?.find((x) => x.lang === locale)?.value ||
              order.area?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
        </p>
        <p>
          {t("Street Name")}: <span>{order.streetName}</span>
        </p>
        <p>
          {t("Building Number")}: <span>{order.buildingNumber}</span>
        </p>
        <p>
          {t("Floor / Apartment Number")}: <span>{order.floorNumber}</span>
        </p>
        <p>
          {t("Landmark")}: <span>{order.landMark}</span>
        </p>
        <p>
          {t("Phone Number")}: <span>{order.phoneNumber}</span>
        </p>
        <p>
          {t("Status")}: <span>{order.status}</span>
        </p>
        <p>
          {t("Total")}:{" "}
          <span>
            {order.netTotal} {t("EGP")}
          </span>
        </p>
      </div>

      <div className={styles["order__actions"]}>
        <Link
          href={"/account/order/" + order.orderId}
          className="btn__contained"
        >
          <Icon icon="majesticons:checkbox-list-detail" width="20" />
          {t("Details")}
        </Link>
      </div>
    </div>
  );
}

export default OrderCard;
