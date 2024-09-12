const fs = require("fs");
const path = require("path");
const artifacts = require("hardhat").artifacts;

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are deploying to the Hardhat Network, which is reset every run. Use '--network localhost' for persistent deployment."
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy contracts
  const contracts = {};
  contracts["TokenA"] = await deployContract("TokenA");
  contracts["NFTB"] = await deployContract("NFTB");
  contracts["Logic"] = await deployContract("Logic", await contracts["TokenA"].getAddress(), await contracts["NFTB"].getAddress());

  await contracts["TokenA"].connect(deployer).approveForTransfer(await contracts["Logic"].getAddress());

  // Save deployed contracts to frontend and backend
  saveFiles(contracts);
}

async function deployContract(contractName, ...args) {
  try {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...args, {
      gasPrice: ethers.parseUnits("25", "gwei"), // Increase the gas price as needed
    });
    // await contract.deployed();
    console.log(`${contractName} deployed at:`, await contract.getAddress());
    return contract;
  } catch (error) {
    console.error(`Failed to deploy ${contractName}`, error);
    process.exit(1);
  }
}

function saveFiles(contracts) {
  const contractsDirFe = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "contracts"
  );

  const contractsDirBe = path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "contracts"
  );

  // Create directories if they don't exist
  if (!fs.existsSync(contractsDirFe)) {
    fs.mkdirSync(contractsDirFe, { recursive: true });
  }

  if (!fs.existsSync(contractsDirBe)) {
    fs.mkdirSync(contractsDirBe, { recursive: true });
  }

  const contractAddresses = Object.keys(contracts).reduce((addresses, name) => {
    addresses[name] = contracts[name].address;
    return addresses;
  }, {});

  // Write contract addresses to frontend and backend
  writeJSONFile(
    path.join(contractsDirFe, "contract-address.json"),
    contractAddresses
  );
  writeJSONFile(
    path.join(contractsDirBe, "contract-address.json"),
    contractAddresses
  );

  for (const [name, contract] of Object.entries(contracts)) {
    try {
      const artifact = artifacts.readArtifactSync(name);

      // Write artifact to frontend and backend
      writeJSONFile(path.join(contractsDirFe, `${name}.json`), artifact);
      writeJSONFile(path.join(contractsDirBe, `${name}.json`), artifact);
    } catch (error) {
      console.error(`Error processing contract ${name}:`, error);
    }
  }
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// function saveFrontendFiles(contracts) {
//   const contractsDir = path.join(
//     __dirname,
//     "..",
//     "..",
//     "frontend",
//     "src",
//     "contracts"
//   );

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   const contractAddresses = Object.keys(contracts).reduce((addresses, name) => {
//     addresses[name] = contracts[name].address;
//     return addresses;
//   }, {});

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-address.json"),
//     JSON.stringify(contractAddresses, null, 2)
//   );

//   for (const [name, contract] of Object.entries(contracts)) {
//     const artifact = artifacts.readArtifactSync(name);
//     fs.writeFileSync(
//       path.join(contractsDir, `${name}.json`),
//       JSON.stringify(artifact, null, 2)
//     );
//   }
// }

// function saveBackendFiles(contracts) {
//   const contractsDir = path.join(
//     __dirname,
//     "..",
//     "..",
//     "backend",
//     "contracts"
//   );

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   const contractAddresses = Object.keys(contracts).reduce((addresses, name) => {
//     addresses[name] = contracts[name].address;
//     return addresses;
//   }, {});

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-address.json"),
//     JSON.stringify(contractAddresses, null, 2)
//   );

//   for (const [name, contract] of Object.entries(contracts)) {
//     const artifact = artifacts.readArtifactSync(name);
//     fs.writeFileSync(
//       path.join(contractsDir, `${name}.json`),
//       JSON.stringify(artifact, null, 2)
//     );
//   }
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script execution failed:", error);
    process.exit(1);
  });