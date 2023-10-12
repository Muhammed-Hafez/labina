import httpAdmin from "@/lib/middleware/httpAdmin";
import { Icon } from "@iconify/react";
import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import styles from "./UploadSinglePhoto.module.scss";

const SUPPORTED_FORMATS = ".jpg,.jpeg,.png,.gif,.webp";

function UploadSinglePhoto({
  setImage,
  image = "",
  imgSize = 1 * 1024 * 1024,
  location = "",
  title = "Upload Photo",
}: {
  setImage: (image: string) => void;
  image: string | undefined;
  imgSize?: number;
  title?: string;
  location?: string;
}) {
  const file = useRef<HTMLInputElement>(null!);
  const { t } = useTranslation();

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

    setImage("");
  }

  function handleFileUpload() {
    if (file.current.files === null || file.current.value === "") return;
    // console.log(file.current.files);
    if (file.current.files.length === 0) return;
    const photo = file.current.files[0];

    if (photo.size > imgSize)
      return alert(
        `'${file.current.name}' size must be less than ${(
          imgSize / 1024
        ).toFixed(0)}kb`
      );

    httpAdmin
      .post(
        "/upload/image?location=" + location,
        { photo },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        // console.log(res);
        setImage(res.data.data);
        file.current.value = "";
        file.current.files = null;
      })
      .catch((err) => {
        // console.error(err)
      });
  }
  return (
    <>
      <div className={styles["upload__img__header"]}>
        <h2>{t(title)}</h2>

        <span>{image}</span>
      </div>

      <br />

      <div className={styles["upload__img__container"]}>
        {image ? (
          <span className={styles["img__container"]}>
            <button
              className={styles["remove__img__btn"]}
              onClick={() => handleRemoveImage(image)}
            >
              <Icon
                icon="ion:close"
                className={styles["remove__img__btn__icon"]}
              />
            </button>
            <img
              src={
                "/api/static/images/" + (location ? location + "/" : "") + image
              }
              alt={image}
            />
          </span>
        ) : (
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
              accept={SUPPORTED_FORMATS}
            />
          </span>
        )}
      </div>
    </>
  );
}

export default UploadSinglePhoto;
