import useAccountStore from '../../../utils/stores/useAccountStore';
import useMintedBalanceStore from '../../../utils/stores/useMintedBalanceStore';
import useReloadDepositInfoStore from '../../../utils/stores/useReloadDepositInfoStore';

const ClaimRewardBtn = ({ contractLogic, contractTokenA }) => {
  const { account } = useAccountStore();
  const {setMintedBalance} = useMintedBalanceStore();
  const { setIsReloadDepositInfo } = useReloadDepositInfoStore();

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

  const clickHandle = async (e) => {
    e.preventDefault();

    if (!contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const tx = await contractLogic.claimReward();
      const receipt = await tx.wait();

      console.log("receipt", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Claim Reward successful");
      
      setIsReloadDepositInfo(true);

      console.log("Claim Reward successful");
      updateBalance();
    } catch (error) {
      console.error("Claim Reward failed:", error);
    }
  }

  return (
    <>
      <form>
        <button
          className='px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 active:bg-green-700 transition duration-150 ease-in-out'
          onClick={clickHandle}
        >
          Claim Reward</button>
      </form>
    </>
  )
}

export default ClaimRewardBtn;