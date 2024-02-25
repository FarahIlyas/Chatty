import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text, VStack } from "@chakra-ui/layout";

const UserHeader = () => {
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2x1"}>Mark Zuckerberg</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>markzuckerberg</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"}>
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={"xl"} />
        </Box>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
