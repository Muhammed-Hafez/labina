import styles from "../../styles/client/TermsConditions.module.scss";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface IDeliveryProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IDeliveryProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const DeliveryPolicy = () => {
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
          <h2>{t("Labina Delivery Policy:")}</h2>
        </div>

        <div className="terms__details">
          <p>
            {t(
              `In these terms, the following words have the following meanings.`
            )}
          </p>
          <h3>{t(`Contract`)}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(`The contract for the sale and purchase of the Goods`)}
          </p>

          <h3>{t(`Delivery Area`)}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(`We deliver across Egypt.`)}
          </p>

          <h3>{t(`Details of the orders.`)}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `The quantity, quality, and description of the goods will be those set out in your order (if accepted by us). Orders are accepted at our sole discretion but are usually accepted if the goods are available, the order reflects current pricing, you are located in the Delivery Area and your credit or account card is authorized for the transaction. The Goods that can be ordered via our website are available for sale.`
            )}
          </p>

          <h3>{t("Payment Policy")}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `5.1 We will charge your credit card account for payment upon receipt of the order unless delivery cannot be fulfilled within (14) days. Items with a lead time greater than 30 days will be charged up to 14 days prior to dispatch.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `5.2 We accept no liability if a delivery is delayed because you did not give us the right payment details. If it is not possible to obtain full payment for the Goods from your account on delivery of the Goods to you, we can cancel the contract or suspend any further deliveries to you. This does not affect any other rights we may have.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `5.3 We will take all reasonable care to keep all information connected with your order secure but we cannot be held liable for any loss that you may suffer if a third party obtains unauthorized access to any data, including credit and account details you provide when accessing or ordering from this website unless this is solely due to our negligence. to you. This does not affect any other rights we may have.`
            )}
          </p>

          <h3>{t(`Delivery Terms`)}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `6.1 We will deliver the Goods to the address you specify for delivery in your order. If payment is made by card, goods must be sent to the address shown on the card statement.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `6.2 It is important that this address is accurate. All orders dispatched will require a signature on delivery. We will never leave items unless they have been signed for.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `6.3 We cannot accept any liability for any loss or damage to the Goods once they have been delivered and signed for. We will aim to deliver the Goods by the date quoted for delivery, but delivery times are not guaranteed.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `6.4 If delivery is delayed due to any cause beyond our reasonable control, the delivery date will be extended by a reasonable period and we will contact you to arrange an alternative time.`
            )}
          </p>

          <h3>{t(`Risk and Ownership`)}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `Risk of damage to or loss of the Goods passes to you at the time of delivery to you or, if you fail to take delivery at the agreed time, the time when we tried to deliver. You will only own the Goods once they have been successfully delivered and when we have received cleared payment in full.`
            )}
          </p>

          <h3>{t("Return and Refund Policy:")}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `8.1 Our policy is valid for a period of 14 working days from the date of the purchase. If you receive your order and are not satisfied for any reason you can return the product for a refund. If the period of 14 working days has lapsed since the purchase, we can’t, unfortunately, offer you a refund. In case of a refund, neither the original shipping cost nor the return shipping cost will be repaid.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `8.2 If the refund is requested, it must be unopened, in original packaging, unused, and must not be damaged.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `8.3 If you are however returning an item because it is damaged, faulty, or in any way defective, Labina will refund the delivery and return fee upon receipt of the goods. If your parcel is damaged, we will gladly replace it in return for a photo of the damage to enable us to review it.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              "8.4 Perishable goods are completely exempt from being returned."
            )}
          </p>

          <h3>{t("Pricing:")}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `The prices for all products are clearly displayed on the website. If, however, an item is priced incorrectly, we will inform you of the correct price before proceeding with the contract.`
            )}
          </p>
          <p style={{ marginInlineStart: "1rem" }}>{t(`- MasterCard`)}</p>
          <p style={{ marginInlineStart: "1rem" }}>{t(`- Visa`)}</p>
          <p style={{ marginInlineStart: "1rem" }}>{t(`- Cash On Delivery`)}</p>
        </div>
      </section>
    </div>
  );
};

export default DeliveryPolicy;
