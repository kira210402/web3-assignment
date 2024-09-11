## Yêu cầu chung
- Viết một dApp tương tác với blockchain EVM dựa trên gợi ý.
- Hoàn thành cả Frontend và Backend, deploy sản phẩm lên cloud. 
- Gửi link github, demo và video (giống assignment 2)
- Giao diện không cần đẹp miễn đủ chức năng
- Sử dụng testnet: BSC testnet

## Mô tả yêu cầu
- Viết smart contract có chức năng deposit token A (ERC20) vào APR = 8%. Token A sau khi được deposit sẽ bị lock trong khoảng thời gian 5 phút (giả định 5 phút cho test nhanh).
- Khi deposit được 1 lượng token nhất định (trên 1M token) thì nhận được 1 NFT ERC 721 B chứng nhận.
- User có thể withdraw khi token ko bị lock (có thể chỉ claim reward mà giữ nguyên token gốc - 2 option withdraw và claim reward)
- Hiển thị lịch sử giao dịch của user (paging, sắp xếp theo thời gian).

## Nâng cao (làm khi đã xong yêu cầu chung)
1. Nếu người dùng deposit thêm NFT B vào thì với mỗi NFT sẽ tăng APR thêm 2%. Lưu ý việc tăng/giảm  % APR  chỉ xảy ra từ thời điểm deposit/withdraw NFT B.
2. Có trang admin dùng để quản lý con số APR (có thể update). 
Admin có quyền xem giao dịch của tất cả, search theo ví (paging, sắp xếp theo thời gian)

## Chức năng
- Sign in with Metamask
- Thao tác chức năng deposit, withdraw token ERC20 trên FE
- Crawl data trên BE

## user deposit tokenA, lượng NFTB được nhận = lượng deposit / 1M - lượng NFTB đã có
- user deposit tokenA thêm vào thì sẽ tính lãi tiếp = tổng lượng tokenA đã deposit
- user claim reward sẽ nhận được lãi (bất cứ lúc nào)
- user withdraw (nếu không bị lock) sẽ rút hết cả gốc + lãi
- user deposit 1 NFTB thì sẽ tăng APR lên 2%, và lãi mới sẽ tính từ thời điểm NFTB được deposit dựa trên lượng gốc + lãi trước đó
- user withdraw NFTB thì sẽ giảm lãi 2%, và lãi tính tiếp = lượng tokenA đã deposit lúc đó

=> struct ( address, apr, timestamp, amountTokenA, nftCount, ownedNFTs )

## fe
- login với metamask, có signature
- login with "wallet connect"
- kết nối với các smartcontract và gọi hàm

