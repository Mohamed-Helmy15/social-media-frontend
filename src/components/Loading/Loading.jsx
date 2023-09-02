import React from "react";
import styles from "./Loading.module.css";
const Loading = () => {
  return (
    <div
      className={styles.pageWrapper}
      style={{
        height: "100vh",
      }}
    >
      <div className={styles.cube_wrapper}>
        <div className={styles.cube_folding}>
          <span className={styles.leaf1}></span>
          <span className={styles.leaf2}></span>
          <span className={styles.leaf3}></span>
          <span className={styles.leaf4}></span>
        </div>
        <span className={styles.loading} data-name="Loading">
          Loading
        </span>
      </div>
    </div>
  );
};

export default Loading;
