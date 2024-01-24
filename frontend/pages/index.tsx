import {
  ChakraProvider,
  Container,
  Box,
  Flex,
  Heading,
  Text,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";


const DynamicButton = dynamic(
  () =>
    import("@chakra-ui/react").then((module) => ({ default: module.Button })),
  { ssr: false }
);

const DiscordButton = () => (
  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-block",
      background: "#7289DA", // Discord color
      color: "#FFFFFF",
      padding: "10px 20px",
      borderRadius: "10px", // Adjust the border-radius for softer edges
      textDecoration: "none",
      fontWeight: "bold",
      marginTop: '20px',
    }}
  >
    <FontAwesomeIcon icon={faDiscord} style={{ marginRight: '10px' }} />
    Join our Discord
  </a>
);

const Index: React.FC = () => {
  const [isSmallerScreen] = useMediaQuery("(max-width: 768px)");

  return (
    <ChakraProvider>
      <Container maxW="container.lg" centerContent>
        {/* Welcome Section */}
        <Box textAlign="center" padding="6">
          <Heading as="h1" size="xl">
          Welcome to Honey Bears Farmland
          </Heading>
          <Text fontSize="lg" mt="4">
          an engaging NFT idle game that invites players into the charming world of Honey Bears and their sweet journey of farming Nectarine. In this delightful virtual farmland, players take on the role of Honey Bears, adorable character with a passion for farming nectarine.
          </Text>
          {/* Play Now Button */}
          <Link href="/play" passHref>
            <DynamicButton colorScheme="orange" size="lg" mt="4">
              Play Now
            </DynamicButton>
          </Link>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            justify="center"
          >
            <Image
              src="/BongBear 57.png"
              alt="Honey Bears Farmlan"
              mt="6"
              maxW="100%"
              maxHeight="400px" // Adjust the maxHeight to your preference
              borderRadius="10px"
              objectFit="cover" // or 'contain' based on your preference
            />
            <Image
              src="/BongBear 62.png"
              alt="Honey Bears Farmlan"
              mt="6"
              maxW="100%"
              maxHeight="400px" // Adjust the maxHeight to your preference
              borderRadius="10px"
              objectFit="cover" // or 'contain' based on your preference
            />
          </Flex>
        </Box>

        {/* About Section */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDir={{ base: "column", md: "row" }}
          padding="6"
          bgColor="gray.100"
        >
          <Box textAlign="center" maxW={{ base: "100%", md: "45%" }}>
            <Heading as="h2" size="lg">
              About Honey Bears Farmland
            </Heading>
            <Text fontSize="md" mt="4">
            In this game, you get to hang out with cute Honey Bears and collect them as your virtual buddies. They love farming Nectarines for you, making it a super chill experience. The best part? You can exchange the Nectarines they farm for real rewards – it's like turning game fun into actual goodies! Your Honey Bears use special tools to make farming even more awesome. And guess what? You can trade and sell these cool tools in the open marketplace. So, if you're into cute bears, easygoing farming, and turning virtual wins into real treats, Honey Bears Farmland is your go-to idle game!
            </Text>
          </Box>
          <Image
            src="BongBear 23.png"
            alt="About Honey Bears Farmlan"
            mt={{ base: "6", md: "0" }}
            maxW="100%"
            maxHeight="400px" // Adjust the maxHeight to your preference
            borderRadius="10px"
            objectFit="cover" // or 'contain' based on your preference
          />
        </Flex>

        {/* How to Play Section */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDir={{ base: "column-reverse", md: "row" }}
          padding="6"
        >
          <Image
            src="BongBear 01.png"
            alt="How to Play Honey Bears Farmland"
            mt={{ base: "6", md: "0" }}
            maxW="100%"
            maxHeight="400px" // Adjust the maxHeight to your preference
            borderRadius="10px"
            objectFit="cover" // or 'contain' based on your preference
          />
          <Box textAlign="center" maxW={{ base: "100%", md: "45%" }}>
            <Heading as="h2" size="lg">
              How to Play
            </Heading>
            <Text fontSize="md" mt="4">
            <ol>
  <li>Mint your first Honey Bear with 0.0025 BERA.</li>
  <li>Equip your Honey Bear with tools using NCTRN.</li>
  <li>Your Bear farms Nectarines automatically once equipped.</li>
  <li>Claim your sweet Nectarine harvest from each tool.</li>
</ol>
<p>That's it! Enjoy the relaxing world of Honey Bears Farmland. 🍯🐻</p>

            </Text>
          </Box>
        </Flex>
        {/* Discord CTA Button */}
        <DiscordButton />
      </Container>
    </ChakraProvider>
  );
};

export default Index;
