import Link from "next/link";
import styles from "./Branch.module.scss";
import { useTranslation } from "next-i18next";

interface IBranchCardProps {
  name: string;
  description: string;
  url: string;
}

const BranchCard = (branchList: IBranchCardProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles["branch__card"]} key={branchList.name}>
      <h3>{t(`${branchList.name}`)}</h3>
      <p>{t(`${branchList.description}`)}</p>
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <Link href={branchList.url}>{t("Get Location")}</Link>
      </div>
    </div>
  );
};

export default BranchCard;
