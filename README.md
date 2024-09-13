## Web3-assignment
http://nam.naha-marketplace.io.vn

http://18.142.50.74/
### Techs: 
- smart contract: hardhat
- frontend: react, tailwindcss, ethers
- backend: express, mongo, web3
### Functions
- faucet native tokens (TokenA)
- deposit TokenA (if deposit more than 1M, get 1 NFTB per 1M), then being locked in 30s before able to withdraw
- deposit NFTB to increase APR by an additional 2%
- withdraw TokenA
- withdraw NFTB
- claim reward
- view list of transactions with detailed information
- set new apr (only for owner)

### Mô tả smart contract

 1. Contract TokenA
- Mapping _approveForTransfer: Lưu trữ các address được approve để chuyển token.
- Modifier onlyApprovedForTransfer: Kiểm tra xem người gửi có được approve để chuyển token hay không.
- Hàm approveForTransfer: Approve cho một address có quyền chuyển token.
- Hàm transferToUser: Chuyển token đến address user, chỉ những address được approve mới có thể gọi hàm này.
- Hàm faucet: Cho phép người dùng mint một lượng token từ tài khoản chủ sở hữu.
- Hàm _claimReward: Chuyển thưởng từ owner đến address người dùng.
- Hàm claimReward: Yêu cầu claim reward từ owner, chỉ những address được approve mới có thể gọi hàm này.
2. Contract NFTB (ERC721)
- Biến _tokenIdCounter: Đếm số lượng token đã được tạo ra.
- Mapping _ownedTokens: Lưu trữ danh sách các token mà mỗi địa chỉ sở hữu.
- Hàm mint: Tạo token mới và chuyển nó đến địa chỉ chỉ định.
- Hàm getBalanceNFT: Trả về số lượng NFT mà địa chỉ sở hữu.
- Hàm getOwnedTokens: Trả về danh sách các token mà địa chỉ sở hữu.
- Hàm removeOwnedToken: Xóa token khỏi danh sách sở hữu của địa chỉ.
- Hàm addOwnedToken: Thêm token vào danh sách sở hữu của địa chỉ.
3. Contract Logic
- Mapping deposits: Lưu trữ thông tin giao dịch với contract Logic của từng địa chỉ.
- Mapping userNFTDepositeds: Lưu trữ danh sách các NFT đã deposit của từng địa chỉ.
- Mảng depositors: Lưu trữ các địa chỉ đã thực hiện deposit.
- Struct DepositInfo: Chứa thông tin về số TokenA deposited, số lượng NFT, timestamp, lãi suất, và APR.
- Các sự kiện (event): Ghi lại các hoạt động deposit TokenA/NFTB, rút TokenA/NFTB, claim reward.
#### Các main function
- depositTokenA: Người dùng gửi TokenA, tự động cập nhật lãi suất và mint NFT nếu số lượng TokenA đủ điều kiện.
- depositNFTB: Người dùng gửi NFT, cập nhật lãi suất và tăng APR.
- withdrawTokenA: Người dùng rút TokenA đã gửi sau thời gian khóa.
- withdrawNFTB: Người dùng rút NFT đã gửi, giảm APR.
- claimReward: Yêu cầu nhận phần thưởng tính trên số tiền đã gửi và APR.
#### Các hàm getter
- getDepositInfo: Lấy thông tin về danh sách NFT đã deposit của user.
- getAPR: Lấy thông tin về APR hiện tại của address.
- getNFTDepositeds: Lấy thông tin về giao dịch với contract Logic của 1 address.
#### Các hàm setter
- setAPR: Cập nhật APR cơ bản cho toàn bộ hệ thống.
#### Các hàm support
- updateInterest: Cập nhật lãi suất cho người dùng dựa trên thời gian gửi và APR.
- updateAllAPR: Cập nhật APR cho tất cả người gửi dựa trên số lượng NFT đã gửi.

