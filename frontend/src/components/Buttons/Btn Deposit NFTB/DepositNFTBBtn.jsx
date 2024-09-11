const DepositNFTBBtn = ({contractLogic, contractNFTB}) => {
  const depositNFTB = async (e) => {
    e.preventDefault();
    const tokenId = document.getElementById("depositNFTB").value;
    console.log('tokenId', tokenId);

    if (!contractNFTB || !contractLogic) {
      console.error("Contracts not initialized correctly");
      return;
    }

    try {
      const approveTx = await contractNFTB.approve(
        await contractLogic.getAddress(),
        tokenId
      );
      await approveTx.wait();

      const tx = await contractLogic.depositNFTB(tokenId);
      const receipt = await tx.wait();

      console.log("receipt", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      alert("Deposit successful");
      console.log("Deposit successful");

      // set input value to empty
      document.getElementById("depositNFTB").value = "";
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  }

  return (
    <>
    <form className="flex items-center gap-2 mb-4">
        <label
          htmlFor="depositNFTB"
          className='text-sm font-medium text-gray-700'
        >
          Deposit NFTB: 
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
          type="number"
          name="depositNFTB"
          id="depositNFTB"
          min="0"
          max="5000000000"
          required
        />
        <button
          className='px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 active:bg-red-700 transition duration-150 ease-in-out'
          onClick={depositNFTB}
        >
          Deposit
        </button>

      </form>
    </>
  )
}

export default DepositNFTBBtn;