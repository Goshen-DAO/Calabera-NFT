import {
    MediaRenderer,
    detectContractFeature,
    useActiveClaimConditionForWallet,
    useAddress,
    useClaimConditions,
    useClaimedNFTSupply,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContract,
    useContractMetadata,
    useNFT,
    useUnclaimedNFTSupply,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { HONEY_BEARS_ADDRESS } from "../const/addresses";
  import { Box, Container, Flex, Heading } from "@chakra-ui/react";
  import { BigNumber, utils } from "ethers";
  import { useMemo, useState } from "react";
  import { useToast } from "./ui/use-toast";
  import { parseIneligibility } from "../utils/parseIneligibility";

  import {
    primaryColorConst,
    themeConst,
  } from "../const/parameters";

  const contractAddress =  HONEY_BEARS_ADDRESS || "";
  const primaryColor =
     primaryColorConst || undefined;
  
  const colors = {
    purple: "#7C3AED",
    blue: "#3B82F6",
    orange: "#F59E0B",
    pink: "#EC4899",
    green: "#10B981",
    red: "#EF4444",
    teal: "#14B8A6",
    cyan: "#22D3EE",
    yellow: "#FBBF24",
  } as const;

  export function MintHoneyBear() {
    const { contract } = useContract(HONEY_BEARS_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);
  
    const contractQuery = useContract(contractAddress);
    const { toast } = useToast();
    let theme =  themeConst || "light" as
      | "light"
      | "dark"
      | "system";
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    const root = window.document.documentElement;
    root.classList.add(theme);
    const address = useAddress();
    const [quantity] = useState(1);
    const activeClaimCondition = useActiveClaimConditionForWallet(
      contractQuery.contract,
      address,
    );
    const claimerProofs = useClaimerProofs(contractQuery.contract, address || "");
    const claimIneligibilityReasons = useClaimIneligibilityReasons(
      contractQuery.contract,
      {
        quantity,
        walletAddress: address || "",
      },
    );
    const unclaimedSupply = useUnclaimedNFTSupply(contractQuery.contract);
    const claimedSupply = useClaimedNFTSupply(contractQuery.contract);
    const { data: firstNft, isLoading: firstNftLoading } = useNFT(
      contractQuery.contract,
      0,
    );
  
    const numberClaimed = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0).toString();
    }, [claimedSupply]);
  
    const numberTotal = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0)
        .add(BigNumber.from(unclaimedSupply.data || 0))
        .toString();
    }, [claimedSupply.data, unclaimedSupply.data]);
  
    const priceToMint = useMemo(() => {
      const bnPrice = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
      );
      return `${utils.formatUnits(
        bnPrice.mul(quantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18,
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }, [
      activeClaimCondition.data?.currencyMetadata.decimals,
      activeClaimCondition.data?.currencyMetadata.symbol,
      activeClaimCondition.data?.currencyMetadata.value,
      quantity,
    ]);
  
    const isOpenEdition = useMemo(() => {
      if (contractQuery?.contract) {
        const contractWrapper = (contractQuery.contract as any).contractWrapper;
  
        const featureDetected = detectContractFeature(
          contractWrapper,
          "ERC721SharedMetadata",
        );
  
        return featureDetected;
      }
      return false;
    }, [contractQuery.contract]);
  
    const maxClaimable = useMemo(() => {
      let bnMaxClaimable;
      try {
        bnMaxClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimableSupply || 0,
        );
      } catch (e) {
        bnMaxClaimable = BigNumber.from(1_000_000);
      }
  
      let perTransactionClaimable;
      try {
        perTransactionClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimablePerWallet || 0,
        );
      } catch (e) {
        perTransactionClaimable = BigNumber.from(1_000_000);
      }
  
      if (perTransactionClaimable.lte(bnMaxClaimable)) {
        bnMaxClaimable = perTransactionClaimable;
      }
  
      const snapshotClaimable = claimerProofs.data?.maxClaimable;
  
      if (snapshotClaimable) {
        if (snapshotClaimable === "0") {
          // allowed unlimited for the snapshot
          bnMaxClaimable = BigNumber.from(1_000_000);
        } else {
          try {
            bnMaxClaimable = BigNumber.from(snapshotClaimable);
          } catch (e) {
            // fall back to default case
          }
        }
      }
  
      const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);
  
      let max;
      if (maxAvailable.lt(bnMaxClaimable) && !isOpenEdition) {
        max = maxAvailable;
      } else {
        max = bnMaxClaimable;
      }
  
      if (max.gte(1_000_000)) {
        return 1_000_000;
      }
      return max.toNumber();
    }, [
      claimerProofs.data?.maxClaimable,
      unclaimedSupply.data,
      activeClaimCondition.data?.maxClaimableSupply,
      activeClaimCondition.data?.maxClaimablePerWallet,
    ]);
  
    const isSoldOut = useMemo(() => {
      try {
        return (
          (activeClaimCondition.isSuccess &&
            BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
              0,
            )) ||
          (numberClaimed === numberTotal && !isOpenEdition)
        );
      } catch (e) {
        return false;
      }
    }, [
      activeClaimCondition.data?.availableSupply,
      activeClaimCondition.isSuccess,
      numberClaimed,
      numberTotal,
      isOpenEdition,
    ]);
  
    const canClaim = useMemo(() => {
      return (
        activeClaimCondition.isSuccess &&
        claimIneligibilityReasons.isSuccess &&
        claimIneligibilityReasons.data?.length === 0 &&
        !isSoldOut
      );
    }, [
      activeClaimCondition.isSuccess,
      claimIneligibilityReasons.data?.length,
      claimIneligibilityReasons.isSuccess,
      isSoldOut,
    ]);
  
    const isLoading = useMemo(() => {
      return (
        activeClaimCondition.isLoading ||
        unclaimedSupply.isLoading ||
        claimedSupply.isLoading ||
        !contractQuery.contract
      );
    }, [
      activeClaimCondition.isLoading,
      contractQuery.contract,
      claimedSupply.isLoading,
      unclaimedSupply.isLoading,
    ]);
  
    const buttonLoading = useMemo(
      () => isLoading || claimIneligibilityReasons.isLoading,
      [claimIneligibilityReasons.isLoading, isLoading],
    );
  
    const buttonText = useMemo(() => {
      if (isSoldOut) {
        return "Sold Out";
      }
  
      if (canClaim) {
        const pricePerToken = BigNumber.from(
          activeClaimCondition.data?.currencyMetadata.value || 0,
        );
        if (pricePerToken.eq(0)) {
          return "Mint (Free)";
        }
        return `Mint (${priceToMint})`;
      }
      if (claimIneligibilityReasons.data?.length) {
        return parseIneligibility(claimIneligibilityReasons.data, quantity);
      }
      if (buttonLoading) {
        return "Checking eligibility...";
      }
  
      return "Minting not available";
    }, [
      isSoldOut,
      canClaim,
      claimIneligibilityReasons.data,
      buttonLoading,
      activeClaimCondition.data?.currencyMetadata.value,
      priceToMint,
      quantity,
    ]);
    return (
      <Container maxW={"1200px"}>
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"50vh"}
        >
          <Heading>Get a Honey Bear to start farming</Heading>
          <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
            <MediaRenderer src={metadata?.image} height="300px" width="300px" />
          </Box>

          <Web3Button
                      contractAddress={HONEY_BEARS_ADDRESS}
                      style={{
                        backgroundColor:
                          colors[primaryColor as keyof typeof colors] ||
                          primaryColor,
                        maxHeight: "43px",
                      }}
                      action={(cntr) => cntr.erc721.claim(1)}
                      isDisabled={!canClaim || buttonLoading}
                      onError={(err) => {
                        console.error(err);
                        console.log({ err });
                        toast({
                          title: "Failed to mint NFT",
                          description: (err as any).reason || "",
                          duration: 9000,
                          variant: "destructive",
                        });
                      }}
                      onSuccess={() => {
                        toast({
                          title: "Successfully minted",
                          description:
                            "The NFT has been transferred to your wallet",
                          duration: 5000,
                          className: "bg-green-500",
                        });
                      }}
                    >
                      {buttonLoading ? (
                        <div role="status" className="flex items-center justify-center">
                        <span className="sr-only">Checking Wallet...</span>
                    </div>
                    
                      ) : (
                        buttonText
                      )}
                    </Web3Button>
        </Flex>
      </Container>
    );
  }
  