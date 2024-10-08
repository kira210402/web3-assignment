import useAccountStore from '../../../utils/stores/useAccountStore';
import useMintedBalanceStore from '../../../utils/stores/useMintedBalanceStore';
import useReloadDepositInfoStore from '../../../utils/stores/useReloadDepositInfoStore';
import { tokens } from '../../../utils/tokens';

const DepositTokenABtn = ({ contractTokenA, contractLogic }) => {
  const { account } = useAccountStore();
  const { setMintedBalance, mintedBalance } = useMintedBalanceStore();
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

  const depositTokenA = async (e) => {
    e.preventDefault();
    let amount = document.getElementById("depositTokenA").value;
    console.log('amount', amount);
    if (!(amount > 0 && amount <= mintedBalance)) {
      alert("Invalid amount");
      document.getElementById("depositTokenA").value = "";
      return;
    }

    amount = tokens(amount);

    if (!contractTokenA || !contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const approveTx = await contractTokenA.approve(
        await contractLogic.getAddress(),
        amount
      );
      await approveTx.wait();

      const tx = await contractLogic.depositTokenA(amount);
      const receipt = await tx.wait();

      console.log("receipt", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Deposit successful");
      await updateBalance();
      console.log("Deposit successful");

      // set input value to empty
      document.getElementById("depositTokenA").value = "";
      setIsReloadDepositInfo(true);
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  }

  return (
    <>
      <form className="flex items-center gap-2 mb-4">
        <label
          htmlFor="depositTokenA"
          className='text-sm font-medium text-gray-700'
        >
          Deposit TokenA:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
          type="number"
          name="depositTokenA"
          id="depositTokenA"
          required
        />
        <button
          className='py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          onClick={depositTokenA}
        >
          Deposit
        </button>

      </form>
    </>
  )
}


export default DepositTokenABtn;