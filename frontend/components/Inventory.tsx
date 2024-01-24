import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  Text,
  Box,
  Button,
  Card,
  SimpleGrid,
  Stack,
  useToast,
  Flex
} from "@chakra-ui/react";

type Props = {
  nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
  const address = useAddress();
  const toast = useToast();
  const { contract: toolContract, error: toolContractError } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const [quantities, setQuantities] = useState<number[]>([]);

  async function stakeNFT(id: string) {
    if (!address) {
      return;
    }

    const isApproved = await toolContract?.erc1155.isApproved(
      address,
      STAKING_ADDRESS
    );

    if (!isApproved) {
      await toolContract?.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
    }
    await stakingContract?.call("stake", [id, 1]);
  }


  useEffect(() => {
    const fetchQuantities = async () => {
      if (nft && nft.length > 0) {
        const quantitiesArray = await Promise.all(
          nft.map(async (nftItem) => getQuantityForTokenId(nftItem.metadata.id))
        );
        setQuantities(quantitiesArray);
      }
    };

    fetchQuantities();
  }, [nft, address, toolContract]);

  useEffect(() => {
    if (toolContractError) {
      console.error("Error connecting to tool contract:", toolContractError);
    }
  }, [toolContractError]);

  const getQuantityForTokenId = async (tokenId: string): Promise<number> => {
    if (!address || !toolContract) {
      return 0;
    }

    try {
      // Use the "balanceOf" method to get the quantity of the specific token for the user
      const balance = await toolContract.call("balanceOf", [address, tokenId]);
      console.log("Balance for Token ID", tokenId, ":", balance);

      // Convert the BigNumber object to a number or a string
      const quantity = balance.toNumber(); // or .toString()

      // Adjust the return value based on the structure of the returned data
      return quantity;

    } catch (error) {
      console.error("Error fetching balance for Token ID", tokenId, ":", error);
      return 0; // Handle errors gracefully, return a default value
    }
  };

  const handleEquipSuccess = () => {
    toast({
      title: "Equip Successful",
      description: "You have successfully equipped a tool.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEquipError = (error: any) => {
    console.error("Equip Error:", error);
    // Display an error message
    toast({
      title: "Equip Error",
      description: "Something went wrong while equipping tools.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEquipSubmit = () => {
    console.log("Transaction for equipping has been submitted.");
  };

  if (nft?.length === 0) {
    return (
      <>
        <Box>
          <Text>No tools.</Text>
          <Link href="/shop">
            <Button>Buy Tools</Button>
          </Link>
        </Box>
      </>
    );
  }

  return (
    <SimpleGrid alignItems="center" columns={1} spacing={4}>
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
      >
        {nft?.map((nft, index) => (
          <Card key={nft.metadata.id} p={5}>
            <Stack alignItems={"center"}>
              <MediaRenderer src={nft.metadata.image} height="100px" width="100px" />
              <b><Text>{nft.metadata.name}</Text></b>
              <Text>Quantity: {quantities[index] !== undefined ? quantities[index] : "N/A"}</Text>

              <Web3Button
                contractAddress={STAKING_ADDRESS}
                action={() => stakeNFT(nft.metadata.id)}
                onSuccess={handleEquipSuccess}
                onError={handleEquipError}
                onSubmit={handleEquipSubmit}
              >
                Equip
              </Web3Button>
            </Stack>
          </Card>
          ))}
      </Flex>
    </SimpleGrid>
  );
}