import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { httpClientSSR } from "@/lib/middleware/httpClient";
import { IProductGet } from "@/lib/@types/Product";
import HeroCarousel from "@/lib/components/client/home/HeroCarousel";
import Categories from "@/lib/components/client/home/Categories";
import OfferSection from "@/lib/components/client/home/OfferSection";
import FeaturedProducts from "@/lib/components/client/home/FeaturedProducts";
import BrandSection from "@/lib/components/client/home/BrandSection";
import NewProducts from "@/lib/components/client/home/NewProducts";
import TopSellingProducts from "@/lib/components/client/home/TopSellingProducts";
import SecondaryCategories from "@/lib/components/client/home/SecondaryCategories";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { IHomepageGet } from "@/lib/@types/Homepage";
import { useClientStore } from "@/lib/store/clientStore";
import { useEffect } from "react";
import apiPaths from "@/lib/@types/enum/apiPaths";

interface IHomeProps extends ITranslate {
  homepage?: IHomepageGet;
  newProductList?: IProductGet[];
  featuredProductList?: IProductGet[];
  bestProductList?: IProductGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IHomeProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  try {
    const res = await httpClientSSR(req).get("/homepage");
    props.homepage = await res.data.data;
    // useClientStore.setState({ homepageSettings: await res.data.data });
  } catch (err: any) {
    // console.log("Homepage settings Error: ", err);
  }

  try {
    const res = await httpClientSSR(req).get(apiPaths.featuredProductListHome);
    props.featuredProductList = await res.data.data;
  } catch (err: any) {
    // console.log("Featured Products Error: ", err);
  }

  try {
    const res = await httpClientSSR(req).get(apiPaths.newProductListHome);
    props.newProductList = await res.data.data;
  } catch (err: any) {
    // console.log("New Products Error: ", err);
  }

  try {
    const res = await httpClientSSR(req).get("/product/best");
    props.bestProductList = await res.data.data;
  } catch (err: any) {}

  return {
    props,
    // revalidate: 1 * 60 * 60, // 1 hour
  };
};

export default function Home(props: IHomeProps) {
  const { homepageSettings, setHomepageSettings } = useClientStore();
  useEffect(() => {
    setHomepageSettings(props.homepage);
  }, []);

  return (
    <>
      {homepageSettings?.isHeroCarousel && <HeroCarousel />}
      {homepageSettings?.isCategorySection && <Categories />}
      {homepageSettings?.isNewProductSection &&
        props.newProductList &&
        props.newProductList.length > 0 && (
          <NewProducts productList={props.newProductList} />
        )}
      {homepageSettings?.isBannerOne && <OfferSection />}
      {homepageSettings?.isFeaturedProductSection &&
        props.featuredProductList &&
        props.featuredProductList.length > 0 && (
          <FeaturedProducts productList={props.featuredProductList} />
        )}
      {homepageSettings?.isBannerTwo && <BrandSection />}
      {homepageSettings?.isTopSellingProductSection &&
        props.bestProductList &&
        props.bestProductList.length > 0 && (
          <TopSellingProducts productList={props.bestProductList} />
        )}
      {/* {homepageSettings?.isRecipeSection && <Recipe />} */}
      {/* <PromotionsProducts />  */}
      {homepageSettings?.isAdvertisementSection && <SecondaryCategories />}
    </>
  );
}
