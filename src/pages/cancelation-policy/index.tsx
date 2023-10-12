import styles from "../../styles/client/TermsConditions.module.scss";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface ICancelationProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ICancelationProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const CancelationPolicy = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathSegments = router.asPath.split("/");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name = segment === "" ? "Home" : segment;

    return {
      href,
      name,
    };
  });

  return (
    <div style={{ maxWidth: "1300px", marginInline: "auto" }}>
      <div
        style={{
          padding: "1rem 2rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link href={breadcrumb.href} key={breadcrumb.name}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1).replaceAll("-", " ")}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      <section className={styles["terms__section"]}>
        <div className={styles["terms__heading"]}>
          <h2>{t(`Labina return policy:`)}</h2>
        </div>

        <div className="terms__details">
          <h3>
            {t(
              `Labina believes you deserve the best products and the best shopping experience.`
            )}
          </h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `Labina would like you to be completely satisfied with your purchase. If you ever wish to return or exchange an item, please make sure it is done within xx days of the purchase date. Your item must be unused and in the same condition that you received it. Please visit the branch you've previously purchased the product from if you wish to return it.`
            )}
          </p>

          <p>{t(`If you have any questions please contact 01020401400`)}</p>
        </div>
      </section>
    </div>
  );
};

export default CancelationPolicy;
