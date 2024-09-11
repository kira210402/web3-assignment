import Header from '../../components/Header/Header'

const AdminPage = ({ contractLogic }) => {
  const setNewApr = async (e) => {
    e.preventDefault();

    const newApr = document.getElementById('newApr').value;
    await contractLogic.setAPR(newApr);
    console.log('New apr set to:', newApr);
    const newAPRR = await contractLogic.BASE_APR();
    console.log('New apr set to:', newAPRR.toString());
    alert('New apr set to: ' + newAPRR.toString());

    document.getElementById('newApr').value = '';
  }

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex-1 p-4'>
        <form className="flex items-center gap-2 mb-4">
          <label
            htmlFor="faucetTokenA"
            className='text-sm font-medium text-gray-700'
          >
            Set new APR:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm"
            type="number"
            name="newApr"
            id="newApr"
            min="0"
            max="100"
            required
          />
          <button
            className='py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onClick={setNewApr}
          >
            Set
          </button>
        </form>
      </div>

    </div>
  )
}

export default AdminPage