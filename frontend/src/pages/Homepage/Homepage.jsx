import Main from '../../components/Main/Main'
import Header from "../../components/Header/Header";

const Homepage = ({ contractLogic, contractNFTB, contractTokenA }) => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex-1 p-4'>
        <Main
          contractLogic={contractLogic}
          contractTokenA={contractTokenA}
          contractNFTB={contractNFTB}
        />
      </div>
    </div>
  )
}

export default Homepage