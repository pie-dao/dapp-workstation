import { ethers } from "hardhat";
import { TEST_ACCOUNTS, WHALES, TOKENS } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const _transfer = async () => {
  await transfer({
    token: TOKENS.LOOKS,
    whale: WHALES.LOOKS,
    receiver: TEST_ACCOUNTS.FAKE_NEWS,
    quantity: 10_000,
  });
};

_transfer()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
