import useNFTBsDepositedStore from '../../../utils/stores/useNFTBsDepositedStore';
import useReloadDepositInfoStore from '../../../utils/stores/useReloadDepositInfoStore';

const WithdrawNFTBBtn = ({ contractLogic, contractNFTB }) => {
  const { NFTBsDeposited } = useNFTBsDepositedStore();
  const { setIsReloadDepositInfo } = useReloadDepositInfoStore();

  const withdrawNFTB = async (e) => {
    e.preventDefault();
    const tokenId = document.getElementById("withdrawNFTB").value;
    console.log('tokenId', tokenId);

    if (!tokenId || !NFTBsDeposited.includes(Number(tokenId))) {
      alert("this NFTB is not deposited");
      document.getElementById("withdrawNFTB").value = "";
      return;
    }

    if (!contractNFTB || !contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const tx = await contractLogic.withdrawNFTB(tokenId);
      const receipt = await tx.wait();

      console.log("receipt", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Withdraw NFTB successful");
      console.log("Withdraw NFTB successful");

      setIsReloadDepositInfo(true);

      // set input value to empty
      document.getElementById("withdrawNFTB").value = "";
    } catch (error) {
      console.error("Withdraw NFTB failed:", error);
    }
  }

  return (
    <>
      <form className="flex items-center gap-2 mb-4">
        <label
          htmlFor="withdrawNFTB"
          className='text-sm font-medium text-gray-700'
        >
          Withdraw NFTB:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
          type="number"
          name="withdrawNFTB"
          id="withdrawNFTB"
          min="0"
          max="5000000000"
          required
        />
        <button
          className='px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 active:bg-red-700 transition duration-150 ease-in-out'
          onClick={withdrawNFTB}
        >
          Withdraw
        </button>

      </form>
    </>
  )
}

export default WithdrawNFTBBtn;