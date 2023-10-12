import React, { useState } from "react";
import styles from "@/styles/client/Branch.module.scss";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import BranchCard from "@/lib/components/client/home/Branch";
import { SelectChangeEvent } from "@mui/material";
import { IBranchGet } from "@/lib/@types/Branch";
import { httpAdminSSR } from "@/lib/middleware/httpAdmin";
import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { getAutocompleteLabel } from "@/lib/@types/stables";

type OptionContent = {
  [key: string]: JSX.Element;
};

interface IBranchProps extends ITranslate {
  branchList: IBranchGet[];
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  let props: IBranchProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
    branchList: [],
  };

  try {
    const res = await httpAdminSSR(req).get("/branch");
    props.branchList = await res.data.data;
  } catch (error) {}

  return {
    props,
  };
};

// const branches = [
//   {
//     _id: "1",
//     name: "New Cairo",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "2",
//     name: "Chillout El Rehab",
//     description: "Mohammed Nagib Axis, Second New Cairo, Cairo City 4751010",
//     url: "https://goo.gl/maps/UR8hdKVx3ZSpuXHj8",
//   },
//   {
//     _id: "3",
//     name: "Air-Mall Madinaty",
//     description: "Madinaty Entrance 2, Second New Cairo, Cairo City 4770202",
//     url: "https://goo.gl/maps/j2WSVptTUe8uCB1w7",
//   },
//   {
//     _id: "4",
//     name: "Nasr City",
//     description:
//       "40 Ahmed Fakhry, Al Manteqah as Sadesah, Nasr City, Cairo City 4450460",
//     url: "https://goo.gl/maps/uN2K8CdXGimgQ47w8",
//   },
//   {
//     _id: "5",
//     name: "Sheraton",
//     description:
//       "10-72 Hamza Ibn Abd El-Mottalib, Al Matar, El Nozha, Cairo City 4470734",
//     url: "https://goo.gl/maps/qUjp76hcJC8j8DiY6",
//   },
//   {
//     _id: "6",
//     name: "Heliopolis1",
//     description: "22 Ahmed Tayseer, Al Golf, Nasr City, Cairo City 4451114",
//     url: "https://goo.gl/maps/qzExJT51S6Le7qaw8",
//   },
//   {
//     _id: "7",
//     name: "Maadi",
//     description: "Maadi as Sarayat Al Gharbeyah, Maadi, Cairo City 4213217",
//     url: "https://goo.gl/maps/Luwwyuq8BCzWzX6M6",
//   },
//   {
//     _id: "8",
//     name: "El Mokattam",
//     description: "St. 9 Biside Awlad Ragab Al Abageyah, Cairo City 4413220",
//     url: "https://goo.gl/maps/jeHqKYu1HMvizmCe9",
//   },
// ];

// const giza = [
//   {
//     _id: "1",
//     name: "Kirdasa",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "2",
//     name: "Awseme",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "3",
//     name: "Basos",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "4",
//     name: "El Saff",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "5",
//     name: "El Obour",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "6",
//     name: "Badr City",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "7",
//     name: "10th of Ramadan City",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
// ];

// const alex = [
//   {
//     _id: "1",
//     name: "Abu Qir",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "2",
//     name: "Bitash",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "3",
//     name: "Bianchi",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "4",
//     name: "Burj Al Arab",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "5",
//     name: "West Alexandria Compound",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "6",
//     name: "Toson",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
// ];

// const delta = [
//   {
//     _id: "1",
//     name: "El Sharqia",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "2",
//     name: "El Gharbia",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "3",
//     name: "Mansoura",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "4",
//     name: "Domeyat",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "5",
//     name: "El Mahla",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "6",
//     name: "El Daqhlia",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "7",
//     name: "Ismailia",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "8",
//     name: "Port Said",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "9",
//     name: "Port Fouad",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
// ];

// const upperEgypt = [
//   {
//     _id: "1",
//     name: "Fayoum",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "2",
//     name: "Bani Sweif",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "3",
//     name: "Minya",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "4",
//     name: "Sohag",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "5",
//     name: "Qena",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
//   {
//     _id: "6",
//     name: "Asyut",
//     description: "S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411",
//     url: "https://goo.gl/maps/kGUUH4xTw1zjY6aM8",
//   },
// ];

// const areas = [
//   {
//     id: "1",
//     name: "Giza",
//     value: "giza2",
//   },
//   {
//     id: "2",
//     name: "Alexandria",
//     value: "alex",
//   },
//   {
//     id: "3",
//     name: "Delta",
//     value: "delta",
//   },
//   {
//     id: "4",
//     name: "Upper Egypt",
//     value: "upper-egypt",
//   },

//   {
//     id: "5",
//     name: "Luxor",
//     value: "luxor",
//   },
//   {
//     id: "6",
//     name: "Aswan",
//     value: "aswan",
//   },
//   {
//     id: "7",
//     name: "Hurghada",
//     value: "hurghada",
//   },
//   {
//     id: "8",
//     name: "The Red Sea",
//     value: "the-red-sea",
//   },
//   {
//     id: "9",
//     name: "Sahl Hasheesh",
//     value: "sahl-hasheesh",
//   },
//   {
//     id: "10",
//     name: "Ras Ghareb",
//     value: "ras-ghareb",
//   },
//   {
//     id: "11",
//     name: "Ras Muhammed",
//     value: "ras-muhammed",
//   },
//   {
//     id: "12",
//     name: "Marsa Alam",
//     value: "marsa-alam",
//   },
//   {
//     id: "13",
//     name: "Dahab",
//     value: "dahab",
//   },
//   {
//     id: "14",
//     name: "Nuweiba",
//     value: "nuweiba",
//   },
//   {
//     id: "15",
//     name: "Safaga",
//     value: "safaga",
//   },
// ];

function Branch(props: IBranchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathSegments = router.asPath.split("/");
  const [branchList, setBranchList] = useState(props.branchList);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(1, index + 1).join("/")}`;
    const name = segment === "" ? "Home" : segment;

    return {
      href,
      name,
    };
  });

  const [selectedArea, setSelectedArea] = useState("giza2");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedArea(event.target.value);
  };

  // const optionContent: OptionContent = {
  //   giza2: (
  //     <div className="branches__cont">
  //       {giza.map((branch) => (
  //         <BranchCard
  //           key={branch._id}
  //           name={branch.name}
  //           description={branch.description}
  //           url={branch.url}
  //         />
  //       ))}
  //     </div>
  //   ),
  //   alex: (
  //     <div className="branches__cont">
  //       {alex.map((branch) => (
  //         <BranchCard
  //           key={branch._id}
  //           name={branch.name}
  //           description={branch.description}
  //           url={branch.url}
  //         />
  //       ))}
  //     </div>
  //   ),
  //   delta: (
  //     <div className="branches__cont">
  //       {delta.map((branch) => (
  //         <BranchCard
  //           key={branch._id}
  //           name={branch.name}
  //           description={branch.description}
  //           url={branch.url}
  //         />
  //       ))}
  //     </div>
  //   ),
  //   "upper-egypt": (
  //     <div className="branches__cont">
  //       {upperEgypt.map((branch) => (
  //         <BranchCard
  //           key={branch._id}
  //           name={branch.name}
  //           description={branch.description}
  //           url={branch.url}
  //         />
  //       ))}
  //     </div>
  //   ),
  //   luxor: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="luxor"
  //         name="Luxor"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   aswan: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="aswan"
  //         name="Aswan"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   hurghada: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="hurghada"
  //         name="Hurghada"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   "the-red-sea": (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="the-red-sea"
  //         name="The Red Sea"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   "sahl-hasheesh": (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="sahl-hasheesh"
  //         name="Sahl Hasheesh"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   "ras-ghareb": (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="ras-ghareb"
  //         name="Ras Ghareb"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   "ras-muhammed": (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="ras-muhammed"
  //         name="Ras Muhammed"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   "marsa-alam": (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="marsa-alam"
  //         name="Marsa Alam"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   dahab: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="dahab"
  //         name="Dahab"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   nuweiba: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="nuweiba"
  //         name="Nuweiba"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  //   safaga: (
  //     <div className="branches__cont">
  //       <BranchCard
  //         key="safaga"
  //         name="Safaga"
  //         description="S Teseen, New Cairo 1, Biside AlexBank, Cairo City 4730411"
  //         url="https://goo.gl/maps/kGUUH4xTw1zjY6aM8"
  //       />
  //     </div>
  //   ),
  // };

  return (
    <div
      className={styles["container__right"]}
      style={{ maxWidth: "1300px", marginInline: "auto" }}
    >
      <div
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <Breadcrumbs dir="ltr" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb) => (
            <Link href={breadcrumb.href} key={breadcrumb.name}>
              {breadcrumb.name.charAt(0).toUpperCase() +
                breadcrumb.name.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      <div>
        <div className="branches__cont">
          {branchList.map((branch) => (
            <BranchCard
              key={branch._id}
              name={getAutocompleteLabel(
                branch.titleList,
                router.locale,
                router.defaultLocale
              )}
              description={getAutocompleteLabel(
                branch.descriptionList,
                router.locale,
                router.defaultLocale
              )}
              url={branch.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Branch;
