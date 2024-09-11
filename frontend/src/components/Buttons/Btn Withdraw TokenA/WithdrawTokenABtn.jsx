import useAccountStore from '../../../utils/stores/useAccountStore';
import useMintedBalanceStore from '../../../utils/stores/useMintedBalanceStore';
import { tokens } from '../../../utils/tokens';

const WithdrawTokenABtn = ({ contractLogic, contractTokenA }) => {
  const { account } = useAccountStore();
  const { setMintedBalance } = useMintedBalanceStore();

  const updateBalance = async () => {
    if (!contractTokenA || !account) return;
    try {
      const balance = await contractTokenA.balanceOf(account);
      setMintedBalance(balance);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const withdrawTokenA = async (e) => {
    e.preventDefault();
    let amount = document.getElementById("withdrawTokenA").value;
    console.log('amount', amount);
    amount = tokens(amount);

    if (!contractTokenA || !contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const tx = await contractLogic.withdrawTokenA(amount);
      const receipt = await tx.wait();

      console.log("receipt", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Withdraw TokenA successful");
      await updateBalance();
      console.log("Withdraw TokenA successful");

      // set input value to empty
      document.getElementById("withdrawTokenA").value = "";
    } catch (error) {
      console.error("Withdraw TokenA failed:", error);
    }
  }

  return (
    <>
      <form className="flex items-center gap-2 mb-4">
        <label
          htmlFor="withdrawTokenA"
          className='text-sm font-medium text-gray-700'
        >
          Withdraw TokenA: 
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
          type="number"
          name="withdrawTokenA"
          id="withdrawTokenA"
          min="0"
          max="5000000000"
          required
        />
        <button
          className='py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          onClick={withdrawTokenA}
        >
          Withdraw
        </button>

      </form>
    </>
  )
}

export default WithdrawTokenABtn;