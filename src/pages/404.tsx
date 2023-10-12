import Image from "next/image";
import Link from "next/link";

import notFound from "../../public/images/404.svg";

import styles from "../styles/client/PageNotFound.module.scss";

function PageNotFound() {
  return (
    <main className={styles.main}>
      <h3>Page Not Found</h3>

      <Link href="/" className={styles.homepage__btn}>
        Homepage
      </Link>
    </main>
  );
}

export default PageNotFound;
