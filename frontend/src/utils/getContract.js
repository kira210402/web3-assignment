import { ethers } from "ethers";

// Hàm để kết nối với smart contract
export const getContract = async (contractAddress, contractABI) => {
  // Kiểm tra nếu người dùng có cài MetaMask
  if (!window.ethereum) {
    alert("Please install MetaMask to interact with the contract.");
    return;
  }
  
  // Tạo provider và signer từ MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Tạo một instance của smart contract
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
};
