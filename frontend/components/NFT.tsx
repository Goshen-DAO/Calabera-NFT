import { Text, Card, useToast } from "@chakra-ui/react";
import {
  MediaRenderer,
  Web3Button,
  useActiveClaimCondition,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract } = useContract(TOOLS_ADDRESS);
  const toast = useToast();
  const { data, isLoading } = useActiveClaimCondition(
    contract,
    nft.metadata.id // Token ID required for ERC1155 contracts here.
  );

  const handleBuySuccess = () => {
    toast({
      title: "Buy Successful",
      description: "You have successfully bought a tool",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleBuyError = (error: any) => {
    console.error("Error during buy action:", error);
    // Display an error message
    toast({
      title: "Buy Error",
      description: "Something went wrong while buying a tool.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleBuySubmit = () => {
    console.log("Buy transaction submitted");
  };

  return (
    <Card key={nft.metadata.id} overflow={"hidden"}>
      <center>
        <MediaRenderer src={nft.metadata.image} height="150px" width="150px" />{" "}
      </center>
      <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
        {nft.metadata.name}
      </Text>
      {!isLoading && data ? (
        <Text textAlign={"center"} my={5}>
          Price: {ethers.utils.formatEther(data?.price)}
          {" " + "$" + data?.currencyMetadata.symbol}
        </Text>
      ) : (
        <Text>Loading...</Text>
      )}
      <Web3Button
        theme="dark"
        contractAddress={TOOLS_ADDRESS}
        action={(contract) => contract.erc1155.claim(nft.metadata.id, 1)}
        onSuccess={handleBuySuccess}
        onError={handleBuyError}
        onSubmit={handleBuySubmit}
      >
        Buy
      </Web3Button>
    </Card>
  );
}
