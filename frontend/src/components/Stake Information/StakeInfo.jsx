import { useEffect, useState } from 'react';
import useAccountStore from '../../utils/stores/useAccountStore';

const StakeInfo = ({ contractLogic, contractNFTB }) => {
  const { account } = useAccountStore();
  const [depositInfo, setDepositInfo] = useState({
    amountTokenA: 0,
    nftCount: 0,
    timestamp: 0,
    interest: 0,
    apr: 0,
    NFTs: [],
    NFTDepositeds: [],
  });

  // Hàm lấy thông tin deposit từ contract
  const fetchDepositInfo = async () => {
    if (!contractLogic || !account) {
      // console.error("Contract or account not available");
      return;
    }

    try {
      const [
        amountTokenA,
        nftCount,
        timestamp,
        interest,
        apr,
      ] = await contractLogic.getDepositInfo(account);

      const NFTs = await contractNFTB.getOwnedTokens(account);

      const NFTDepositeds = await contractLogic.getNFTDepositeds(account);

      setDepositInfo({
        amountTokenA: amountTokenA.toString(),
        nftCount: nftCount.toString(),
        timestamp: timestamp.toString(),
        interest: interest.toString(),
        apr: apr.toString(),
        NFTs,
        NFTDepositeds,
      });

    } catch (error) {
      console.error("Error fetching deposit info:", error);
    }
  };

  // Gọi hàm fetchDepositInfo khi component mount hoặc khi account thay đổi
  useEffect(() => {
    fetchDepositInfo();
  }, [account, contractLogic]);

  return (
    <div>
      <h3 className='font-bold'>Deposit Information</h3>
      <p>Amount TokenA: {depositInfo.amountTokenA}</p>
      <p>NFT Count: {depositInfo.nftCount}</p>
      <p>Timestamp: {depositInfo.timestamp}</p>
      <p>Interest: {depositInfo.interest}</p>
      <p>APR: {depositInfo.apr}%</p>
      <p>NFTs: {depositInfo.NFTs.join(", ")}</p>
      <p>NFT Depositeds: {depositInfo.NFTDepositeds.join(", ")}</p>
    </div>
  );
};

export default StakeInfo;
