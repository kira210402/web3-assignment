import useAccountStore from '../../../utils/stores/useAccountStore';
import { useEffect, useState } from 'react';
import useMintedBalanceStore from '../../../utils/stores/useMintedBalanceStore';
import { tokens } from '../../../utils/tokens';

const FaucetTokenABtn = ({ contractTokenA }) => {
  const { account, setAccount } = useAccountStore();
  const [tokenData, setTokenData] = useState({ name: '', symbol: '' });
  const { mintedBalance, setMintedBalance } = useMintedBalanceStore();
  // console.log('account', account);

  const updateBalance = async () => {
    if (!contractTokenA || !account) return;
    try {
      let balance = await contractTokenA.balanceOf(account);
      balance = Number(balance) / 10 ** 18;
      setMintedBalance(balance);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  useEffect(() => {
    const getTokenData = async () => {
      if (!contractTokenA) return;
      try {
        const name = await contractTokenA.name();
        const symbol = await contractTokenA.symbol();
        setTokenData({ name, symbol });
      } catch (error) {
        console.error("Error getting token data:", error);
      }
    };
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]); // Cập nhật account vào Zustand
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    // Gọi hàm connectWallet khi component được render
    connectWallet();
    getTokenData();
    updateBalance();
  }, [setAccount, contractTokenA]);

  const mintTokenA = async (e) => {
    e.preventDefault();
    let amount = document.getElementById("faucetTokenA").value;
    console.log('amount TokenA minted', amount);

    if (!(amount > 0 && amount < 5000000000)) {
      alert("Invalid amount");
      document.getElementById("faucetTokenA").value = "";
      return;
    }

    amount = tokens(amount);

    // Kiểm tra nếu contract không tồn tại
    if (!contractTokenA || typeof contractTokenA.faucet !== "function") {
      console.error("Mint method is not available on the contract");
      return;
    }

    // Kiểm tra nếu account chưa được kết nối
    if (!account) {
      console.error('Account not connected');
      return;
    }

    try {
      const tx = await contractTokenA.faucet(amount, { from: account });
      await tx.wait();
      console.log("Mint successful");
      alert("Mint successful");

      // set input value to empty
      document.getElementById("faucetTokenA").value = "";
      await updateBalance();
    } catch (error) {
      console.error("Mint failed:", error);
    }
  };


  if (!contractTokenA) {
    return <div>Loading Faucet TokenA...</div>;
  }

  return (
    <div>
      <form className="flex items-center gap-2 mb-4">
        <label
          htmlFor="faucetTokenA"
          className='text-sm font-medium text-gray-700'
        >
          Faucet TokenA:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
          type="number"
          name="faucetTokenA"
          id="faucetTokenA"
          min="0"
          max="5000000000"
          required
        />
        <button
          className='px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 active:bg-yellow-700 transition duration-150 ease-in-out'
          onClick={mintTokenA} disabled={!account}
        >
          Faucet
        </button>

      </form>
      <div>
        {tokenData.name} ({tokenData.symbol}) balance: {Math.round(mintedBalance * 10000) / 10000} {tokenData.symbol}
      </div>
    </div>
  );
};

export default FaucetTokenABtn;
