import { useEffect, useState } from 'react';
import './App.css';
import { getContract } from './utils/getContract';
import contractAddress from './contracts/contract-address.json';
import logicABI from './contracts/Logic.json';
import tokenAABI from './contracts/TokenA.json';
import NFTBABI from './contracts/NFTB.json';
import useAccountStore from './utils/stores/useAccountStore';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './pages/Homepage/Homepage';
import ExplorerPage from './pages/Explorer Page/ExplorerPage';
import AdminPage from './pages/Admin Page/AdminPage';


const App = () => {
  const [contractLogic, setContractLogic] = useState(null);
  const [contractTokenA, setContractTokenA] = useState(null);
  const [contractNFTB, setContractNFTB] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account } = useAccountStore();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contractLogic = await getContract(contractAddress.Logic, logicABI.abi);
        setContractLogic(contractLogic);

        const contractTokenA = await getContract(contractAddress.TokenA, tokenAABI.abi);
        setContractTokenA(contractTokenA);

        const contractNFTB = await getContract(contractAddress.NFTB, NFTBABI.abi);
        setContractNFTB(contractNFTB);
      } catch (error) {
        console.error('Error interacting with contract:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [account]);

  if (loading) {
    return <div>Loading Contracts...</div>;
  }

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Homepage contractLogic={contractLogic} contractTokenA={contractTokenA} contractNFTB={contractNFTB} />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/admin" element={<AdminPage contractLogic={contractLogic}/>} />
          </Routes>
        </div>
      </Router>

    </>
  );
};

export default App;
