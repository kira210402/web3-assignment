import { useEffect, useState } from 'react';
import useAccountStore from '../../utils/stores/useAccountStore';
import useAmountTokenAStore from '../../utils/stores/useAmountTokenAStore';
import useNFTBsOwnedStore from '../../utils/stores/useNFTBsOwnedStore';
import useNFTBsDepositedStore from '../../utils/stores/useNFTBsDepositedStore';
import useReloadDepositInfoStore from '../../utils/stores/useReloadDepositInfoStore';

const StakeInfo = ({ contractLogic, contractNFTB, setIsCountdownFinished }) => {
  const { account } = useAccountStore();
  const { setAmountTokenA } = useAmountTokenAStore();
  const { setNFTBsOwned } = useNFTBsOwnedStore();
  const { setNFTBsDeposited } = useNFTBsDepositedStore();
  const {isReloadDepositInfo, setIsReloadDepositInfo} = useReloadDepositInfoStore();
  const [depositInfo, setDepositInfo] = useState({
    amountTokenA: 0,
    timestamp: 0,
    interest: 0,
    apr: 0,
    NFTs: [],
    NFTDepositeds: [],
  });

  const [countdown, setCountdown] = useState(30); // Initial countdown value (30 seconds)

  // Fetch deposit information from the contract
  const fetchDepositInfo = async () => {
    if (!contractLogic || !account) {
      return;
    }

    try {
      const [amountTokenA, nftCount, timestamp, interest, apr] = await contractLogic.getDepositInfo(account);
      
      let amountTokenAA = Number(amountTokenA) / 10 ** 18;
      setAmountTokenA(amountTokenAA);

      let NFTs = await contractNFTB.getOwnedTokens(account);
      NFTs = Array.from(NFTs).map(Number)
      setNFTBsOwned(NFTs);

      let NFTDepositeds = await contractLogic.getNFTDepositeds(account);
      NFTDepositeds = Array.from(NFTDepositeds).map(Number)
      setNFTBsDeposited(NFTDepositeds);

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

  // Update countdown when depositInfo.timestamp changes
  useEffect(() => {
    if (depositInfo.timestamp) {
      setCountdown(30); // Reset countdown to 30 seconds when depositInfo updates
    }
  }, [depositInfo.timestamp]);

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) {
      setIsCountdownFinished(true); // Notify parent component that countdown is finished
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, setIsCountdownFinished]);

  // Fetch deposit info when the component mounts or account/contractLogic changes
  useEffect(() => {
    fetchDepositInfo();
    setIsReloadDepositInfo(false);
  }, [account, contractLogic, isReloadDepositInfo]);

  return (
    <div>
      <h3 className='font-bold'>Deposit Information</h3>
      <p>Amount TokenA: {Math.round(Number(depositInfo.amountTokenA) / 10 ** 18 * 10000) / 10000}</p>
      <p>Lock Time: {`${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`}</p>
      <p>Interest: {Math.round(Number(depositInfo.interest) / 10 ** 18 * 10000) / 10000}</p>
      <p>APR: {depositInfo.apr}%</p>
      <p>NFTs Owned: {depositInfo.NFTs.join(", ")}</p>
      <p>NFT Depositeds: {depositInfo.NFTDepositeds.join(", ")}</p>
    </div>
  );
};

export default StakeInfo;
