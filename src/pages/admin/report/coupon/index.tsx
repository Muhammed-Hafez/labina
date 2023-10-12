import ITranslate from "@/lib/@types/interfaces/ITranslate";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/admin/Bowse.module.scss";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import httpAdmin from "@/lib/middleware/httpAdmin";
import { useTranslation } from "next-i18next";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { colorNames } from "@/lib/@types/stables";
import { useAdminStore } from "@/lib/store/adminStore";
import { useRouter } from "next/router";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ICouponReportProps extends ITranslate {}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props: ICouponReportProps = {
    ...(await serverSideTranslations(locale as string, ["common"])),
    locale,
  };

  return {
    props,
  };
};

function CouponReport() {
  const { t } = useTranslation();
  const barRef = useRef();
  const [orderWithCouponData, setOrderWithCouponData] = useState<
    ChartData<any>
  >({
    labels: [],
    datasets: [],
  });
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { locale, defaultLocale, pathname } = useRouter();

  const allowedActions =
    useAdminStore((state) => state.adminInfo)?.permissionList.find((x) =>
      x.permission.pathname.startsWith(pathname)
    )?.actionList ?? [];

  const data: ChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu"],
    datasets: [
      {
        label: "Number of coupon usage",
        data: [3, 6, 20, 5],
        backgroundColor: ["red", "blue"],
      },
    ],
  };

  useEffect(() => {
    async function getData() {
      httpAdmin
        .get(
          `/report/coupon?start=${
            startDate && startDate.isValid() ? startDate.toISOString() : ""
          }&end=${endDate && endDate.isValid() ? endDate.toISOString() : ""}`
        )
        .then((res) => {
          console.log(res);
          setOrderWithCouponData((prev) => {
            const curr = { ...prev };
            const data = [];

            for (let i = 0; i < res.data.data.length; i++) {
              const item = res.data.data[i];
              data.push({
                label: item._id,
                backgroundColor: colorNames[i % colorNames.length],
                data: [item.count, (i % 2) + 5, 2, 3],
              });
            }

            console.log(data);

            curr.labels = ["Coupon Usage"];
            curr.datasets = data;
            return curr;
          });
        })
        .catch((err) => {
          // console.log(err)
        });
    }

    getData();
    console.log();
  }, [startDate, endDate]);

  return (
    <div className={`${styles["container"]} container`}>
      <div className={styles["container__header"]}>
        <h1>{t(`Coupon Usage`)}</h1>
      </div>
      <br />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="input__area">
          <div className="input__field">
            <DatePicker
              maxDate={endDate}
              format="DD-MM-YYYY"
              label={t("Start Date")}
              value={startDate}
              onChange={(startDate) => setStartDate(startDate)}
            />
            <DatePicker
              minDate={startDate}
              format="DD-MM-YYYY"
              label={t("End Date")}
              value={endDate}
              onChange={(endDate) => setEndDate(endDate)}
            />
          </div>
        </div>
      </LocalizationProvider>
      <div style={{ maxHeight: "50vh" }}>
        <Bar ref={barRef} data={orderWithCouponData} />
      </div>
    </div>
  );
}

export default CouponReport;
