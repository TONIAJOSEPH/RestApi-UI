"use client";
import styles from "./page.module.css";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import getGoogleOAuthURL from "@/utils/getGoogleUrl";

export default function Home() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher
  );
  if (data) {
    return <div>welcome !! {data.name}</div>;
  }
  return (
    <div className={styles.page}>
      <a href={getGoogleOAuthURL()}>login with google</a>
      Please Login
    </div>
  );
}
