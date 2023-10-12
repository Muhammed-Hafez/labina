import ITranslate from "@/lib/@types/interfaces/ITranslate";
import styles from "../../styles/client/TermsConditions.module.scss";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

interface ITermsProps extends ITranslate {}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props: ITermsProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

const TermsConditions = () => {
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
          <h2>{t("Labina Terms & conditions:")}</h2>
        </div>

        <div className="terms__details">
          <h3>{t(`Terms and Conditions:`)}</h3>
          <p>
            {t(
              `Please read these 'the Terms of Use' and 'Privacy and Refund policies' as they set out your governed access to the Labina website located at hajarafa.com including all associated subsidiaries and affiliates (collectively, operated internet sites), and hereafter Labina services. These terms and conditions are entered into between you (referred to as 'you', 'your', or as a 'user') and Labina Limited Liability Company.`
            )}
            <br /> <br />
            {t(
              `THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION, AS FURTHER OUTLINED IN THE SECTIONS BELOW, WHICH REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR ANY OTHER COURT PROCEEDINGS, OR CLASS ACTIONS OF ANY KIND.`
            )}
          </p>

          <h3>{t(`Conditions of Use:Last updated: (October 28, 2022)`)}</h3>
          <p>
            {t(
              `Welcome to hajarafa.com, and/or its affiliates that provide website features and other products or services to you when you visit or shop at the Labina website, use Labina Applications for mobile, or use the software provided by Labina in connection with any of the foregoing (collective, “Labina Services”). BY USING Labina SERVICES, YOU AGREE, ON BEHALF OF YOURSELF AND ALL MEMBERS OF YOUR HOUSEHOLD AND OTHERS WHO USE ANY SERVICE UNDER YOUR ACCOUNT/ACKNOWLEDGEMENT, TO THE FOLLOWING CONDITIONS:`
            )}
          </p>

          <p
            style={{
              fontStyle: "italic",
            }}
          >
            {t(
              `- By ordering any of our products, you agree to be bound by these terms & conditions.`
            )}
          </p>

          <p
            style={{
              marginInlineStart: "1.5rem",
            }}
          >
            {t(
              `You are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and use our Services. Providing false contact information of any kind may result in the termination of your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by You, including any damages of any kind incurred as a result of such acts or omissions.`
            )}
          </p>

          <ul
            style={{
              listStyleType: "disc",
              listStylePosition: "inside",
              marginInlineStart: "1.5rem",
              marginBottom: "2rem",
              lineHeight: 2,
            }}
          >
            <li>
              {t(
                `The price applicable is that set on the date on which you place your order.`
              )}
            </li>
            <li>
              {t(
                `Shipping costs and payment fees are recognized before confirming the purchase.`
              )}
            </li>
            <li>{t(`Please note that local charges may occur.`)}</li>
            <li>
              {t(
                `Labina reserves the right to amend any information without prior notice.`
              )}
            </li>
          </ul>

          <ol
            style={{
              listStylePosition: "inside",
              marginInlineStart: "1.5rem",
              marginBottom: "2rem",
              lineHeight: 2,
            }}
          >
            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                }}
              >
                {t(`User Account:`)}
              </h4>

              <p>
                {t(
                  `1.1 You retain ownership of your User Content when you post it to the Labina Service. However, for us to make your User Content available on the Labina Service, we do need a limited license from you to that User Content. Accordingly, you hereby grant Labina a non-exclusive, transferable, sub-licensable, fully paid, irrevocable, worldwide license to reproduce, make available, perform and display, translate, modify, create derivative works from, distribute, and otherwise use any such User Content through any medium, whether alone or in combination with other Content or materials, in any manner and by any means, method or technology, whether now known or hereafter created, in connection with the Labina Service.`
                )}
              </p>
              <p>
                {t(
                  `1.2 We are not responsible for Content residing on the Website. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain an appropriate backup of your Content.`
                )}
              </p>
              <p>
                {t(
                  `1.3 We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their websites. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any website which you access through a link from this Website. Your linking to any other off-site websites is at your own risk.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                }}
              >
                {t(`Changes and Amendments:`)}
              </h4>
              <p>
                {t(
                  `We reserve the right to modify this Agreement or its policies relating to the Website or Services at any time, effective upon posting an updated version of this Agreement on the Website. When we do, we will revise the updated date at the bottom of this page. Continued use of the Website after any such changes shall constitute your consent to such changes.`
                )}
              </p>
            </li>

            <li>
              <h4
                style={{
                  marginBottom: "1rem",
                }}
              >
                {t(`Acceptance of this policy:`)}
              </h4>
              <p>
                {t(
                  `You acknowledge that you have read this Policy and agree to all its terms and conditions. By using the Website or its Services you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to use or access the Website and its Services.`
                )}
              </p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
