import axios from 'axios'
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import ContractAddress from "../../contracts/contract-address.json";

const timeAgo = (timestamp) => {
  const seconds = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  const intervals = [
    { label: 'years', seconds: 31536000 },
    { label: 'months', seconds: 2592000 },
    { label: 'days', seconds: 86400 },
    { label: 'hours', seconds: 3600 },
    { label: 'minutes', seconds: 60 },
    { label: 'seconds', seconds: 1 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label} ago`;
    }
  }
  return 'Just now';
};



const ExplorerPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // Thêm state để lưu từ khóa tìm kiếm

  const transactionsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`/api`);
      // const res = await axios.get("http://localhost:5000/api");
      res.data.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tổng số trang
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // handle search
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/${searchQuery}`);
      res.data.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-xl font-bold mb-4">Transaction Explorer</h1>

      {/* Input tìm kiếm */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 flex-1 rounded-l"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">Transaction Hash</th>
            <th className="py-2 px-4 text-left">Type</th>
            <th className="py-2 px-4 text-left">Block Number</th>
            <th className="py-2 px-4 text-left">Age</th>
            <th className="py-2 px-4 text-left">From</th>
            <th className="py-2 px-4 text-left">To</th>
            <th className="py-2 px-4 text-left">Amount (ether)</th>
            <th className="py-2 px-4 text-left">Token ID</th>
            {/* <th className="py-2 px-4 text-left">Gas Used</th>
            <th className="py-2 px-4 text-left">Gas Price</th> */}
            <th className="py-2 px-4 text-left">Txn Fee (gwei)</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((tx, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{`${tx.transactionHash.substring(0, 6)}...${tx.transactionHash.slice(-4)}`}</td>
              <td className="py-2 px-4">{tx.type}</td>
              <td className="py-2 px-4">{tx.blockNumber}</td>
              <td className="py-2 px-4">{timeAgo(tx.timestamp)}</td>
              <td className="py-2 px-4">{`${tx.user.substring(0, 6)}...${tx.user.slice(-4)}`}</td>
              <td className="py-2 px-4">{`${ContractAddress.Logic.substring(0, 6)}...${ContractAddress.Logic.slice(-4)}`}</td>
              <td className="py-2 px-4">{Math.round((tx.amount / 10 ** 18) * 1000) / 1000}</td>
              <td className="py-2 px-4">{tx.tokenId ?? 'N/A'}</td>
              {/* <td className="py-2 px-4">{tx.gasUsed}</td>
              <td className="py-2 px-4">{tx.gasPrice}</td> */}
              <td className="py-2 px-4">{Math.round((tx.txnFee / 10 ** 9) * 1000) / 1000}</td>
            </tr>
          ))}
        </tbody>
      </table >

      {/* Phân trang */}
      < div className="flex justify-center mt-4" >
        {
          Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 border ${currentPage === pageNumber
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500'
                  } hover:bg-blue-400 hover:text-white`}
              >
                {pageNumber}
              </button>
            )
          )
        }
      </div >
    </div >
  )
}

export default ExplorerPage