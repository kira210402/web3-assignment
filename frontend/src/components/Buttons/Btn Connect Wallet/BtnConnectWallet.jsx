import { ethers } from 'ethers';
import useAccountStore from '../../../utils/stores/useAccountStore';

const ConnectWallet = () => {
  const { setAccount, account } = useAccountStore();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      console.log('Connected to chain:', chainId);

      if (chainId !== 97) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
          alert('Switched to BSC Testnet');
        } catch (error) {
          if (error.code === 4902) {
            alert('User rejected the request');
          } else {
            alert('Error switching chain:', error);
          }
        }
      }

      setAccount(accounts[0]);

      // Bạn có thể sử dụng `signer` để thực hiện các giao dịch
      console.log('Connected Account:', accounts[0]);

    } catch (error) {
      alert('Error connecting:', error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default ConnectWallet;