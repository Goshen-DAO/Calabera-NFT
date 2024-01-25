// ScrollableAnnouncement.tsx

import React from 'react';
import styles from '../Styles//ScrollableAnnouncement.module.css'; // Import your CSS module

const ScrollableAnnouncement = () => {
  return (
    <div className={styles.announcement}>
      <marquee behavior="scroll" direction="left">
        <b>Important Announcement:</b> The revenue generated on BERA will be divided equally, with one-half allocated to Honey Bears holders and the remaining half directed to liquidity (WBERA/NCTRN). This distribution will take place every Sunday at 20:00 GMT +8.
      </marquee>
    </div>
  );
};

export default ScrollableAnnouncement;
