import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

function App() {
  const [userAddress, setUserAddress] = useState();
  const [balance, setBalance] = useState(0.0);
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState();

  //Connect to Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "to",
          type: "address",
        },
      ],
      name: "transfer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const contract = new ethers.Contract(contractAddress, ABI, provider);

  const signer = provider.getSigner();
  const new_contract = new ethers.Contract(contractAddress, ABI, signer);
  // Prompt user for account connections

  useEffect(() => {
    async function currentBalance() {
      const currentAddress = await signer.getAddress();
      let currentBalance = await provider.getBalance(currentAddress);
      setCurrentBalance(ethers.utils.formatEther(currentBalance));
    }

    currentBalance();
  }, []);

  async function connectMetamask() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
    } catch (error) {
      console.log(error);
    }
    console.log(await signer.getAddress());
    // const sign = await signer.signMessage("Successfully connect");
    // console.log(sign);
  }

  async function getUserBalance() {
    const balance = await contract.getUserBalance(userAddress);
    setBalance(ethers.utils.formatEther(balance));
  }

  async function transferEth() {
    try {
      const tx = await new_contract.transfer(to, {
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div className="head">
        <div className="logo">
          <h1>Ethereum</h1>
        </div>
        <div className="balance-connect">
          <h3>{currentBalance} ETH</h3>
          <button onClick={connectMetamask}>Connect with Metamask</button>
        </div>
      </div>
      <div className="main">
        <div className="balance">
          <h1>Get Balance</h1>
          <div className="balance">
            <p>
              <span>{balance}</span>
            </p>
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setUserAddress(e.target.value)}
            />
            <button onClick={getUserBalance}>Get Balance</button>
          </div>
        </div>
        <div className="transfer">
          <h1>Transfer ETH</h1>
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={transferEth}>Make Transaction</button>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: {
            // background: "trasparent",
            backdropFilter: "blur(0.1px)",
          },
          content: {
            background: "#0c0c0c",
            width: "40%",
            height: "30vh",
            // display: "flex",
            position: "absolute",
            top: "30%",
            left: "30%",
            color: "white",
          },
        }}
      >
        <h1>Success</h1>
        <h5>Transaction has been completed successfully</h5>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
