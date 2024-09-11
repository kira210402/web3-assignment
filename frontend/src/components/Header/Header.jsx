import { Link } from 'react-router-dom'
import ConnectWalletBtn from '../Buttons/Btn Connect Wallet/BtnConnectWallet'

const Header = () => {

  return (
    <div className='flex justify-between items-center p-5 bg-gray-100 shadow-md'>
      <nav className='flex gap-5'>
        <Link to="/">Home</Link>
        <Link to="/explorer">Explorer</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <ConnectWalletBtn />
    </div>
  )
}

export default Header