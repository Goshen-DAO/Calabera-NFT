import React from "react";
import styles from "../styles/Gameplay.module.css";
import Image from "next/image";

const Nectarine = (
  <div className={styles.slide}>
    <Image src="/nectarine.gif" height="48" width="48" alt="nectarine" />
  </div>
);

type Props = {
  equippedTools: boolean;
};

export default function GameplayAnimation({ equippedTools }: Props) {
  if (!equippedTools) {
    return <div style={{ marginLeft: 8 }}>I need Honey Bears Tools!</div>;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.slideTrack}>
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
        {Nectarine}
      </div>
    </div>
  );
}
