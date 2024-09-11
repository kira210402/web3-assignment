import { ethers } from "ethers";

export const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}