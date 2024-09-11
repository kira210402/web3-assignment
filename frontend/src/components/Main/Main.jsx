import StakeInfo from '../Stake Information/StakeInfo';
import DepositTokenABtn from '../Buttons/Btn Deposit TokenA/DepositTokenABtn';
import DepositNFTBBtn from '../Buttons/Btn Deposit NFTB/DepositNFTBBtn';
import WithdrawTokenABtn from '../Buttons/Btn Withdraw TokenA/WithdrawTokenABtn';
import WithdrawNFTBBtn from '../Buttons/Btn Withdraw NFTB/WithdrawNFTBBtn';
import ClaimRewardBtn from '../Buttons/Btn Claim Reward/ClaimRewardBtn';
import FaucetTokenABtn from '../Buttons/Btn Faucet TokenA/FaucetTokenABtn';

const Main = ({ contractTokenA, contractLogic, contractNFTB }) => {

  return (
    <div className='flex gap-8'>
      <div className='flex flex-col gap-4'>
        <FaucetTokenABtn contractTokenA={contractTokenA} />
        <DepositTokenABtn contractLogic={contractLogic} contractTokenA={contractTokenA} />
        <WithdrawTokenABtn contractLogic={contractLogic} contractTokenA={contractTokenA} />
        <DepositNFTBBtn contractLogic={contractLogic} contractNFTB={contractNFTB} />
        <WithdrawNFTBBtn contractLogic={contractLogic} contractNFTB={contractNFTB} />
        <ClaimRewardBtn contractLogic={contractLogic} contractTokenA={contractTokenA}/>
      </div>
      <div className='flex-1'>
        <StakeInfo contractLogic={contractLogic} contractNFTB={contractNFTB} />
      </div>
    </div>
  );
}

export default Main;