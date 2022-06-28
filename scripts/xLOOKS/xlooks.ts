import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as hre from "hardhat";
import { ethers } from "hardhat";
import ERC20ABI from "../../abi/erc20.json";
import XLOOKS_ABI from "../../abi/xlooks.json";
import AggregatorFeeSharingWithUniswapV3 from "../../abi/AggregatorFeeSharingWithUniswapV3.json";
import { TEST_ACCOUNTS, TOKENS } from "../../utils/addresses";
import { impersonate } from "../../utils/impersonate";

const address = TEST_ACCOUNTS.FAKE_NEWS;
const addy_xl_fork = "0x178e8fe4fa20d6dd8459995da653123721359b72";
const compounder = "0x3ab16Af1315dc6C95F83Cbf522fecF98D00fd9ba";

const getTokens = (account: SignerWithAddress) => {
  // wbtc
  const token = new hre.ethers.Contract(TOKENS.LOOKS, ERC20ABI, account);
  return token;
};

const printBalances = async (address: string, token: any) => {
  const results = await token.balanceOf(address);
  const bal = ethers.utils.formatEther(results);
  console.table([{ TOKEN: bal }]);
};

async function _approve(token: any, address:any) {
  console.log("Approving Looks");
  console.log("Looks Approved");
  const approveTx = await token.approve(addy_xl_fork, ethers.constants.MaxUint256, {
    maxFeePerGas: 99999999999,
  });
  await approveTx.wait();
  const limit = await token.allowance(address, addy_xl_fork);
  console.log({
    limit: limit.eq(hre.ethers.constants.MaxUint256) ? "Max" : limit,
  });
  console.log("Looks Approved");
}

async function report(prefix = "", XL:any) {
  const totalSupplyBefore = await XL.totalSupply();
  const totalAssetsBefore = await XL.totalAssets();
  const sharesOfOwnerbefore = await XL.balanceOf(address);
  const underSharesBefore = await XL.getUnderlyingShares();

  console.log(
    prefix,
    " totalSupply",
    ethers.utils.formatEther(totalSupplyBefore)
  );
  console.log(
    prefix,
    " totalAssets",
    ethers.utils.formatEther(totalAssetsBefore)
  );
  console.log(
    prefix,
    " sharesOfOwner",
    ethers.utils.formatEther(sharesOfOwnerbefore)
  );
  console.log(
    prefix,
    " underShares",
    ethers.utils.formatEther(underSharesBefore)
  );
}

async function _deposit(XL:any) {
  console.log("Initiating Deposit");
  console.log("-------------------------------\n");
  const depositTx = await XL.deposit("10000000000000000000", address);
  await depositTx.wait();
  console.log("\nDeposit ✅\n");
  await report("After Deposit", XL);
}

async function _redeem(XL:any) {
  const sharesOfOwner = await XL.balanceOf(address);
  const preview = await XL.previewRedeem(sharesOfOwner);
  console.log(
    "Preview ",
    ethers.utils.formatEther(preview),
    " LOOKS for",
    ethers.utils.formatEther(sharesOfOwner)
  );

  console.log("Redeeming ", ethers.utils.formatEther(sharesOfOwner), " shares");
  console.log("-------------------------------\n");
  const redeemTx = await XL.redeem(sharesOfOwner, address, address, {
    maxFeePerGas: 99999999999,
  });
  await redeemTx.wait();
  await report("After Redeem", XL);
}

async function _withdraw(XL:any, numberOfAssets = "5000000000000000000") {
  console.log(numberOfAssets);
  const preview = await XL.previewWithdraw(numberOfAssets);
  console.log(
    "Preview ",
    ethers.utils.formatEther(preview),
    " LOOKS for",
    preview
  );

  const preview2 = await XL.__previewWithdraw(numberOfAssets);
  console.log(
    "Preview ",
    ethers.utils.formatEther(preview2),
    " LOOKS for",
    preview2
  );
  

  console.log("Withdrawing ", ethers.utils.formatEther(numberOfAssets), " shares");
  console.log("-------------------------------\n");
  
  const withdrawTx = await XL.withdraw("5000000000000000000", address, address, {
    maxFeePerGas: 99999999999,
  });
  await withdrawTx.wait();
  await report("After Redeem", XL);
}

const main = async () => {
  const account = await impersonate(address);
  const token = getTokens(account);
  const XL = new hre.ethers.Contract(addy_xl_fork, XLOOKS_ABI, account);

  console.log(
    "Balance LOOKS in xLOOKS",
    ethers.utils.formatEther(await token.balanceOf(addy_xl_fork))
  );
  await printBalances(address, token);

  await _approve(token, address);

  await report("Before Deposit", XL);

  await _deposit(XL);
  await _withdraw(XL);
  await _redeem(XL);
  
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
