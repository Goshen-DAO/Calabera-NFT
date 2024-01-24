import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import {
  Text,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import NFT from "../components/NFT";

export default function Shop() {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts } = useNFTs(contract);
  console.log(nfts);

  return (
    <Container maxW={"1440px"} py={4}>
      <Link href="/play">
        <Button mb={4}>Back</Button>
      </Link>
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems={"center"}
      >
        <Heading mt={{ base: 4, md: 0 }}>Shop</Heading>
      </Flex>
      <Text mt={4}>
        Purchase tools with $BLCRSTL to increase your earnings.
      </Text>
      {!nfts ? (
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={8}>
          {nfts?.map((nftItem) => (
            <NFT key={nftItem.metadata.id} nft={nftItem} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
