import { IProductGet } from "@/lib/@types/Product";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { getAutocompleteLabel } from "@/lib/@types/stables";
import { useRouter } from "next/router";
import { ICategoryGet } from "@/lib/@types/Category";
import { ISizeGet } from "@/lib/@types/Size";

function FilterProduct({
  data,
  setFilteredData,
}: {
  data: IProductGet[];
  setFilteredData: Function;
}) {
  const { locale, defaultLocale } = useRouter();
  const { t } = useTranslation();
  const [categoryOptions, setCategoryOptions] = useState<ICategoryGet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryGet | null>(
    null
  );
  const [sizeOptions, setSizeOptions] = useState<ISizeGet[]>([]);
  const [selectedSize, setSelectedSize] = useState<ISizeGet | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [promotionsOnly, setPromotionsOnly] = useState(false);

  // const minPriceOption: number = +data
  //   .reduce(
  //     (prev, curr) =>
  //       Math.min(
  //         prev,
  //         curr.promotionPrice
  //           ? curr.mainPrice - curr.promotionPrice
  //           : curr.mainPrice
  //       ),
  //     0
  //   )
  //   .toFixed(2);

  // const maxPriceOption: number = +data
  //   .reduce(
  //     (prev, curr) =>
  //       Math.max(
  //         prev,
  //         curr.promotionPrice
  //           ? curr.mainPrice - curr.promotionPrice
  //           : curr.mainPrice
  //       ),
  //     0
  //   )
  //   .toFixed(2);

  // const [minPrice, setMinPrice] = useState<number>(minPriceOption);
  // const [maxPrice, setMaxPrice] = useState<number>(maxPriceOption);

  useEffect(() => {
    let catObj: any = {};
    let sizeObj: any = {};
    for (let i = 0; i < data.length; i++) {
      const prod = data[i];
      catObj[prod.category._id] = prod.category;
      prod.size && (sizeObj[prod.size._id] = prod.size);
    }

    setCategoryOptions(Object.values(catObj));
    setSizeOptions(Object.values(sizeObj));
  }, [data]);

  function applyFilter() {
    /*
      min price
      max price
      new product
      featured product
      promotion
      category
      size
    */

    // if (selectedCategory) {
    //   console.log(selectedCategory);
    //   console.log(selectedSize);
    // }

    setFilteredData(
      data.filter((prod) => {
        // const price = prod.mainPrice - (prod.promotionPrice ?? 0);
        // if (!isNaN(minPrice) && price < minPrice) return false;
        // if (!isNaN(maxPrice) && price > maxPrice) return false;

        if (isNew && !prod.isNewProduct) return false;
        if (isFeatured && !prod.isFeaturedProduct) return false;
        if (promotionsOnly && (prod.promotionPrice ?? 0) === 0) return false;

        if (selectedCategory && selectedCategory._id !== prod.category._id)
          return false;

        if (selectedSize && selectedSize._id !== prod.size?._id) return false;

        return true;
      })
    );
  }

  function clearFilter() {
    // setMinPrice(minPriceOption);
    // setMaxPrice(maxPriceOption);
    setIsNew(false);
    setIsFeatured(false);
    setPromotionsOnly(false);
    setSelectedCategory(null);
    setSelectedSize(null);

    setFilteredData(data);
  }

  return (
    <div style={{ padding: 16 }}>
      <div>{t("Products Filter")}</div>

      <div>
        <div className="input__area">
          <div className="input__field">
            <FormGroup>
              <FormControlLabel
                label={t("New Products")}
                control={
                  <Checkbox
                    checked={isNew}
                    onChange={(e, val) => setIsNew(val)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
              <FormControlLabel
                label={t("Featured Products")}
                control={
                  <Checkbox
                    checked={isFeatured}
                    onChange={(e, val) => setIsFeatured(val)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
              <FormControlLabel
                label={t("Promotions Only")}
                control={
                  <Checkbox
                    checked={promotionsOnly}
                    onChange={(e, val) => setPromotionsOnly(val)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </FormGroup>
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedCategory}
              onChange={(_, val) => {
                setSelectedCategory(val);
              }}
              autoHighlight
              options={categoryOptions}
              fullWidth
              getOptionLabel={(opt) =>
                getAutocompleteLabel(opt.titleList, locale, defaultLocale)
              }
              renderOption={(props, option) => (
                <Box key={option._id} component="li" {...props}>
                  {getAutocompleteLabel(
                    option.titleList,
                    locale,
                    defaultLocale
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(`Category`)}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="input__area">
          <div className="input__field">
            <Autocomplete
              value={selectedSize}
              onChange={(_, val) => {
                setSelectedSize(val);
              }}
              autoHighlight
              options={sizeOptions}
              fullWidth
              getOptionLabel={(opt) =>
                getAutocompleteLabel(opt.titleList, locale, defaultLocale)
              }
              renderOption={(props, option) => (
                <Box key={option._id} component="li" {...props}>
                  {getAutocompleteLabel(
                    option.titleList,
                    locale,
                    defaultLocale
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(`Size`)}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill from browser
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* <div className="input__area">
          <h3>{t("Price")}</h3>
          <br />
          <div className="input__field">
            <TextField
              type="number"
              fullWidth
              label={t("Min")}
              inputProps={{
                inputMode: "numeric",
                "aria-valuemin": minPriceOption,
                "aria-valuemax": maxPriceOption,
              }}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(+e.target.value);
              }}
            />
            <TextField
              type="number"
              fullWidth
              label={t("Max")}
              inputProps={{
                inputMode: "numeric",
                "aria-valuemin": minPriceOption,
                "aria-valuemax": maxPriceOption,
              }}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(+e.target.value);
              }}
            />
          </div>
        </div> */}
      </div>
      <div className="input__area">
        <div className="input__field">
          <button onClick={applyFilter} className="btn__contained">
            {t("Apply Filter")}
          </button>
          <button onClick={clearFilter} className="btn__contained error">
            {t("Clear Filter")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterProduct;
