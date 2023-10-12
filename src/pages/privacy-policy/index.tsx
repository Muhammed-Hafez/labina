import styles from "../../styles/client/TermsConditions.module.scss";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UseTranslation, useTranslation } from "next-i18next";

import Link from "next/link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";

interface IPrivacyProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: IPrivacyProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const PrivacyPolicy = () => {
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
          <h2>{t("Labina Privacy Policy:")}</h2>
        </div>

        <div className="terms__details">
          <h3>{t("Personal Information:")}</h3>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `1.1 All personal information you provide us with, or that we obtain will be handled by Labina as responsible for the personal information. The personal information you provide will be used to ensure deliveries to you, the credit assessment, and to provide offers and information on our catalog to you.`
            )}
          </p>
          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `1.2 The information you provide is only available to Labina and will not be shared with other third parties.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `1.3 You always have the right to request Labina to delete or correct the information held about you. By accepting the Labina Conditions, you agree to the above.`
            )}
          </p>

          <p style={{ marginInlineStart: "1rem" }}>
            {t(
              `1.4 Other than the content you own, under these Terms, Labina and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for the purposes of viewing the material contained on this Website.`
            )}
          </p>

          <h3>{t("Restrictions:")}</h3>

          <h5
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              marginInlineStart: "1rem",
            }}
          >
            {t("You are specifically restricted from all of the following:")}
          </h5>
          <ul
            style={{
              listStyleType: "disc",
              listStylePosition: "inside",
              marginInlineStart: "1.5rem",
              marginBottom: "2rem",
              lineHeight: "2",
            }}
          >
            <li>{t("publishing any Website material in any other media")}</li>
            <li>
              {t(
                `selling, sublicensing, and/or otherwise commercializing any Website material`
              )}
            </li>
            <li>
              {t(`publicly performing and/or showing any Website material`)}
            </li>
            <li>
              {t(
                `using this Website in any way that is or may be damaging to this Website;`
              )}
            </li>
            <li>
              {t(
                `using this Website in any way that impacts user access to this Website;`
              )}
            </li>
            <li>
              {t(
                `using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;`
              )}
            </li>
            <li>
              {t(
                `engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to this Website;`
              )}
            </li>
            <li>
              {t(
                `using this Website to engage in any advertising or marketing.`
              )}
            </li>
          </ul>

          <h5
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              marginInlineStart: "0.1rem",
            }}
          >
            {t(
              `Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.`
            )}
          </h5>

          <ol
            style={{
              listStylePosition: "inside",
              marginInlineStart: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t(`No warranties`)}
              </h4>

              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `This Website is provided 'as is,' with all faults, and Labina expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t(`Limitation of liability:`)}
              </h4>
              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `In no event shall hajarafa.com, nor any of its officers, directors, and employees shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. hajarafa.com, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t("Billing and Payment")}
              </h4>
              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `5.1 All products remain Labina’s property until full payment is made. The price applicable is that set on the date on which you place your order.`
                )}
              </p>

              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `5.2 Shipping costs and payment fees are recognized before confirming the purchase.`
                )}
              </p>

              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `5.3 The Services must be paid by credit card via the platform of the provided payment provider or via wire transfer. The Client warrants that it has the funds and the necessary authorizations to use the chosen payment method. In the event of direct debit, the Client agrees to update its bank account information as soon as possible, if necessary.`
                )}
              </p>

              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `5.4 The Company reserves the right to modify its prices at any time. The Client may consult them at any time on the Website. The prices applicable and enforceable to new Clients are the latest published on the Website.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t(`Variation of Terms`)}
              </h4>
              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `hajarafa.com is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t(`Acceptance of this policy`)}
              </h4>
              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `7.1 You hereby indemnify to the fullest extent hajarafa.com from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.`
                )}
              </p>

              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `7.2 The Client's use of the Services is at its own risk. The Services are provided on an 'as is' and 'as available' basis, without any warranties of any kind, either express or implied. Neither the Company nor any person associated with the Company makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Services.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {t("Contacting Us:")}
              </h4>
              <p style={{ marginInlineStart: "1rem" }}>
                {t(
                  `If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to individual rights and your Personal Information, you may do so via our support line: 01020401400`
                )}
              </p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
