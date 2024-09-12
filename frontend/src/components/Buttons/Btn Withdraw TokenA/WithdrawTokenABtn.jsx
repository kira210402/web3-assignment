import useAccountStore from '../../../utils/stores/useAccountStore';
import useAmountTokenAStore from '../../../utils/stores/useAmountTokenAStore';
import useMintedBalanceStore from '../../../utils/stores/useMintedBalanceStore';
import useReloadDepositInfoStore from '../../../utils/stores/useReloadDepositInfoStore';
import { tokens } from '../../../utils/tokens';

const WithdrawTokenABtn = ({ contractLogic, contractTokenA, isCountdownFinished }) => {
  const { account } = useAccountStore();
  const { setMintedBalance } = useMintedBalanceStore();
  const { amountTokenA } = useAmountTokenAStore();
  const {setIsReloadDepositInfo} = useReloadDepositInfoStore();

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

  const withdrawTokenA = async (e) => {
    e.preventDefault();
    let amount = document.getElementById("withdrawTokenA").value;
    
    if (!(amount > 0 && amount <= amountTokenA)) {
      alert("Invalid amount");
      document.getElementById("withdrawTokenA").value = "";
      return;
    }
    
    amount = tokens(amount);

    if (!contractTokenA || !contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const tx = await contractLogic.withdrawTokenA(amount);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Withdraw TokenA successful");
      setIsReloadDepositInfo(true);
      await updateBalance();
      document.getElementById("withdrawTokenA").value = "";
    } catch (error) {
      console.error("Withdraw TokenA failed:", error);
    }
  };


  return (
    <form className="flex items-center gap-2 mb-4">
      <label htmlFor="withdrawTokenA" className='text-sm font-medium text-gray-700'>
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
        disabled={!isCountdownFinished} // Disable the button until the countdown reaches 0
      >
        Withdraw
      </button>
    </form>
  );
};


export default WithdrawTokenABtn;
