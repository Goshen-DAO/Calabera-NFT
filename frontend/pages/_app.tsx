import type { AppProps } from "next/app";
import Head from "next/head";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  embeddedWallet,
  trustWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";

import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollableAnnouncement from "../components/ScrollableAnnouncement";
import "../styles/global.css";

const clientAPI = process.env.THIRDWEB_API_KEY as string;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThirdwebProvider
        activeChain={{// === Required information for connecting to the network === \\
          chainId: 80085, // Chain ID of the network
          // Array of RPC URLs to use
          rpc: ["https://artio.rpc.berachain.com/"],
  
          // === Information for adding the network to your wallet (how it will appear for first time users) === \\
          // Information about the chain's native currency (i.e. the currency that is used to pay for gas)
          nativeCurrency: {
            decimals: 18,
            name: "Berachain Artio",
            symbol: "BERA",
          },
          shortName: "berachainartio", // Display value shown in the wallet UI
          slug: "berachain", // Display value shown in the wallet UI
          testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
          chain: "Berachain", // Name of the network
          name: "Berachain Artio", // Name of the network
        }}
        clientId={clientAPI}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect(),
          safeWallet({
            personalWallets: [
              metamaskWallet(),
              coinbaseWallet(),
              walletConnect(),
              localWallet(),
              embeddedWallet({
                recommended: true,
                auth: {
                  options: [
                    "email",
                    "google",
                    "apple",
                    "facebook",
                  ],
                },
              }),
              trustWallet(),
              rainbowWallet(),
            ],
          }),
          localWallet(),
          embeddedWallet({
            recommended: true,
            auth: {
              options: [
                "email",
                "google",
                "apple",
                "facebook",
              ],
            },
          }),
          trustWallet(),
          rainbowWallet(),
        ]}
      >
        <Head>
          <title>Honey Bears Farmland- #1 On-chain Play-And-Earn Game on Berachain </title>
          <meta
            name="description"
            content="A cool digital world where little goblins use special tools like Pickaxes to dig for treasures powered by the magical Blue Crystal! Each unique Goblin NFT is like a ticket to join the fun. Collect them, explore the mines, and earn awesome rewards. It's like having your own digital mining adventure with magical goblins!"
          />
          <meta property="og:image" content="/BongBear 57.png" />
          <meta name="twitter:card" content="/BongBear 57.png" />
          <meta name="twitter:image" content="/BongBear 57.png" />

          {/* Favicon */}
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

          {/* Apple Touch icon */}
          <link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon.png" />

          {/* Android icons */}
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

          {/* Web Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <ScrollableAnnouncement />
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
