import useAccountStore from '../../../utils/stores/useAccountStore';

const ConnectWallet = () => {
  const {setAccount, account} = useAccountStore();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        setAccount(accounts[0]);

        // Bạn có thể sử dụng `signer` để thực hiện các giao dịch
        console.log('Connected Account:', accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
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