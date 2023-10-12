import httpAdmin from "@/lib/middleware/httpAdmin";
import { Button, Radio } from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import styles from "./UploadMultiPhotos.module.scss";
import { Icon } from "@iconify/react";

const SUPPORTED_FORMATS = ".jpg,.jpeg,.png,.gif,.webp";

function UploadMultiPhotos({
  setMainImg,
  setImgList,
  imgSize = 1 * 1024 * 1024,
  mainImg = "",
  imgList = [],
  title = "Upload Photos",
  location = "",
}: {
  setImgList: (imgList: string[]) => void;
  imgList: string[] | undefined;
  imgSize?: number;
  mainImg?: string;
  setMainImg?: (mainImg: string) => void;
  title?: string;
  location?: string;
}) {
  const { t } = useTranslation();
  const file = useRef<HTMLInputElement>(null!);

  function handleUploadBtn() {
    file.current.click();
  }

  function handleRemoveImage(img: string) {
    httpAdmin
      .delete("/upload/file?location=" + location + "&name=" + img)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.error(err)
      });

    if (setMainImg && imgList.length < 2) setMainImg("");

    setImgList(
      imgList.filter((x, index, arr) => {
        if (x === img) {
          if (setMainImg && x === mainImg) setMainImg(arr[index !== 0 ? 0 : 1]);

          return false;
        }

        return true;
      })
    );

    file.current.value = "";
    file.current.files = null;
  }

  function handleRemoveAllImages() {
    httpAdmin
      .delete(
        "/upload/files?location=" + location + "&name=" + imgList.join("(-_*)")
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.error(err)
      });

    setMainImg && setMainImg("");
    setImgList([]);
    file.current.value = "";
    file.current.files = null;
  }

  function handleFileUpload() {
    if (file.current.files === null || file.current.value === "") return;
    // console.log(file.current.files);
    const uploadedImageList = file.current.files;

    const formData = new FormData();

    for (let i = 0; i < uploadedImageList.length; i++) {
      const fl = uploadedImageList[i];
      // console.log(file);
      if (fl.size > imgSize)
        return alert(
          `'${fl.name}' size must be less than ${(imgSize / 1024).toFixed(0)}kb`
        );

      formData.append("photos", fl);

      // const fname = file.current.name.replace(/[!@#\$%\^&\*\(\)_\+{}\/,\[\\=\ :;'"<div>`~\?]+/g, '-');

      // if (imgList.includes(fname) === false) {
      // 	imgList.push(fname);

      // 	imgList = imgList;
      // }
    }

    // console.log(formData);

    httpAdmin
      .post("/upload/images?location=" + location, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        const list = res.data.data;

        const newList = Array.from(new Set([...imgList, ...list]));

        setImgList(newList);

        !mainImg && setMainImg && setMainImg(newList[0]);
        file.current.value = "";
        file.current.files = null;
      })
      .catch((err) => {
        //  console.error(err)
      });
  }
  return (
    <>
      <div className={styles["upload__img__header"]}>
        <h2>{t(title)}</h2>
        <div className={styles["upload__img__actions"]}>
          <p>{mainImg && <>main image: {mainImg}</>}</p>
          <Button
            variant="contained"
            type="button"
            className={styles["remove__all__img__btn"]}
            disabled={imgList.length === 0}
            onClick={handleRemoveAllImages}
          >
            {t(`Remove All`)}
          </Button>
        </div>
      </div>

      <br />

      <div className={styles["upload__img__container"]}>
        {imgList.map((img, i) => (
          <span key={img} className={styles["img__container"]}>
            <button
              className={styles["remove__img__btn"]}
              onClick={() => handleRemoveImage(img)}
            >
              <Icon
                icon="ion:close"
                className={styles["remove__img__btn__icon"]}
              />
            </button>
            <img
              src={
                "/api/static/images/" + (location ? location + "/" : "") + img
              }
              alt={(i + 1).toString()}
            />
            {mainImg && (
              <div className={styles["main__img"]}>
                <Radio
                  checked={mainImg === img}
                  value={img}
                  onChange={() => {
                    setMainImg && setMainImg(img);
                  }}
                  size="medium"
                />
              </div>
            )}
          </span>
        ))}
        <span
          className={`${styles["img__container"]} ${styles["img__add__btn"]}`}
        >
          <button type="button" onClick={handleUploadBtn}>
            <Icon icon="ic:round-add-photo-alternate" width="40" />
          </button>

          <input
            ref={file}
            type="file"
            hidden
            onChange={handleFileUpload}
            multiple
            accept={SUPPORTED_FORMATS}
          />
        </span>
      </div>
    </>
  );
}

export default UploadMultiPhotos;
