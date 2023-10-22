import "@splidejs/react-splide/css/core";
import React from "react";
import styles from "./HeroCarousel.module.scss";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useRouter } from "next/router";
import { useClientStore } from "@/lib/store/clientStore";

const heroCarouselImages = [
  "images/h1.jpeg",
  "images/h2.webp",
  "images/h3.webp",
];

function HeroCarousel() {
  const { locale } = useRouter();
  const { homepageSettings } = useClientStore();

  return (
    <section className={styles.hero__carousel}>
      <Splide
        options={{
          arrows: false,
          rewind: true,
          type: "loop",
          autoplay: true,
          pauseOnHover: true,
          pauseOnFocus: true,
          pagination: false,
        }}
      >
        {heroCarouselImages.map((img) => (
          <SplideSlide key={img}>
            <div className={styles["hero__img"]}>
              <img src={img} alt={img} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}

export default HeroCarousel;
