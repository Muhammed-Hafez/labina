import { IAddressGet } from "@/lib/@types/Address";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "./AddressCard.module.scss";
import { useTranslation } from "next-i18next";

function AddressCard({
  address,
  isEditable = true,
  setDeletedItemId,
}: {
  address: IAddressGet;
  isEditable?: boolean;
  setDeletedItemId?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { locale, defaultLocale } = useRouter();
  const { t } = useTranslation();

  return (
    <div className={styles["address__book"]}>
      <div className={styles["address__text"]}>
        <p className="country">
          {t("Location: ")}
          <span>
            {address.area?.titleList?.find((x) => x.lang === locale)?.value ||
              address.area?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
          ,{" "}
          <span>
            {address.city?.titleList?.find((x) => x.lang === locale)?.value ||
              address.city?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
          ,{" "}
          <span>
            {address.country?.titleList?.find((x) => x.lang === locale)
              ?.value ||
              address.country?.titleList?.find((x) => x.lang === defaultLocale)
                ?.value ||
              ""}
          </span>
        </p>
        <p>
          {t("Street Name:")} <span>{address.streetName}</span>
        </p>
        <p>
          {t("Building Number:")} <span>{address.buildingNumber}</span>
        </p>
        <p>
          {t("Floor / Apartment Number:")} <span>{address.floorNumber}</span>
        </p>
        <p>
          {t("Landmark: ")} <span>{address.landMark}</span>
        </p>
        <p>
          {t("Phone Number: ")} <span>{address.phoneNumber}</span>
        </p>
      </div>

      <div className={styles["address__actions"]}>
        {isEditable && (
          <>
            <div className={styles["edit__address"]}>
              <Link href={"/account/address/" + address._id}>
                {t("Edit Address")}
              </Link>
            </div>

            <button
              className={styles["delete__address"]}
              onClick={() => {
                setDeletedItemId && setDeletedItemId(address._id);
              }}
            >
              <Icon
                icon="ic:baseline-delete"
                className={styles["delete__icon"]}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AddressCard;
