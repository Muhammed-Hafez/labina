import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./FilterDrawer.module.scss";
import FilterProduct from "../FilterProduct";
import { IProductGet } from "@/lib/@types/Product";

function FilterDrawer({
  filterDrawerOpen,
  setFilterDrawerOpen,
  data,
  setFilteredData,
}: {
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: Function;
  data: IProductGet[];
  setFilteredData: Function;
}) {
  const { t } = useTranslation();

  return (
    <>
      <aside
        className={`${styles["sidebar__container"]} ${
          filterDrawerOpen ? styles["active"] : ""
        }`}
      >
        <FilterProduct data={data} setFilteredData={setFilteredData} />
      </aside>

      {filterDrawerOpen && (
        <button
          className={`overlay ${styles["overlay"]} ${
            filterDrawerOpen ? styles["active"] : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setFilterDrawerOpen(false);
          }}
        />
      )}
    </>
  );
}

export default FilterDrawer;
