import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useNFT,
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, useToast } from "@chakra-ui/react";

interface EquippedProps {
  tokenId: number;
}

export const Equipped = (props: EquippedProps) => {
  const address = useAddress();
  const toast = useToast();

  const { contract: toolContract } = useContract(TOOLS_ADDRESS);
  const { data: nft } = useNFT(toolContract, props.tokenId);

  const { contract: stakingContract } = useContract(STAKING_ADDRESS);

  const { data: claimableRewards } = useContractRead(
    stakingContract,
    "getStakeInfoForToken",
    [props.tokenId, address]
  );

  const handleClaimSuccess = () => {
    toast({
      title: "Claim Successful",
      description: "You have successfully claimed $NCTRN.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClaimError = (error: any) => {
    console.error("Error during claim:", error);
    // Display an error message
    toast({
      title: "Claim Error",
      description: "Something went wrong while claiming rewards.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClaimSubmit = () => {
    console.log("Claim transaction submitted");
  };

  const handleUnequipSuccess = () => {
    toast({
      title: "Unequipping successful",
      description: "You have successfully unequipped a tool.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUnequipError = (error: any) => {
    console.error("Error during unequipping:", error);
    // Display an error message
    toast({
      title: "Error during unequipping",
      description:
        "An error occurred during the process of unequipping the tool.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUnequipSubmit = () => {
    console.log("Transaction for unequipping has been submitted.");
  };

  return (
    <Box>
      {nft && (
        <Card p={{ base: 2, md: 5 }}>
          <Flex
            flexDir={{ base: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
          >
            <Flex flexDir="column" justifyContent="center">
              <MediaRenderer
                src={nft.metadata.image}
                height="150px"
                width="150px"
              />
            </Flex>
            <Flex flexDir="column" justifyContent="center">
              <Stack spacing={3} mt={{ base: 3, md: 0 }}>
                <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
                  {nft.metadata.name}
                </Text>
                <Text>
                <b> Equipped:</b> {ethers.utils.formatUnits(claimableRewards[0], 0)}
                </Text>
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={(contract) =>
                    contract.call("withdraw", [props.tokenId, 1])
                  }
                  onSuccess={handleUnequipSuccess}
                  onError={handleUnequipError}
                  onSubmit={handleUnequipSubmit}
                >
                  Unequip
                </Web3Button>
              

                <b><Text>Claimable $NCTRN:</Text></b>
                <Text>{ethers.utils.formatUnits(claimableRewards[1], 18)}</Text>
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={(contract) =>
                    contract.call("claimRewards", [props.tokenId])
                  }
                  onSuccess={handleClaimSuccess}
                  onError={handleClaimError}
                  onSubmit={handleClaimSubmit}
                >
                  Claim
                </Web3Button>
              </Stack>
            </Flex>
          </Flex>
          
        </Card>
      )}
    </Box>
  );
};
