// global.d.ts

declare namespace JSX {
    interface IntrinsicElements {
      marquee: React.HTMLProps<HTMLMarqueeElement> & {
        behavior?: string;
        direction?: string;
      };
    }
  }
  