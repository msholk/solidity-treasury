import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Bank.json";
import _ from 'lodash';
import { contractAddress } from './contracts/contractAddress'
import { knownAddresses } from './contracts/knownAddresses'
import { BankOwner, CustomerInfo, MoveMoney, BusyBlock, ErrorBlock, AdminPanel } from './components'
let ethInitialized
function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isBankerOwner, setIsBankerOwner] = useState(false);
  const [inputValue, setInputValue] = useState({ withdraw: "", deposit: "", bankName: "" });
  const [bankOwnerAddress, setBankOwnerAddress] = useState(null);
  const [customerTotalBalance, setCustomerTotalBalance] = useState(null);
  const [currentBankName, setCurrentBankName] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState("");

  const contractABI = abi.abi;

  const getcAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      gotAccounts(accounts)
    }
    catch (e) {
      console.error(error);
    }
  }
  const gotAccounts = (accounts) => {
    if (!accounts.length) {
      setIsWalletConnected(false);
      return
    }
    const account = accounts[0];
    setIsWalletConnected(true);
    setCustomerAddress(account);
    console.log("Account Connected: ", account);
    customerBalanceHandler()
  }
  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        if (!ethInitialized) {
          ethInitialized = true
          window.ethereum.on('accountsChanged', gotAccounts);
        }
        getcAccounts()
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAddresWithDic = (address) => {
    address = _.toLower(address)
    return knownAddresses[address] || address
  }

  const getBankName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let bankName = await bankContract.bankName();
        if (bankName) {
          bankName = utils.parseBytes32String(bankName);
        }
        else {
          bankName = "Please name the bank"
        }
        setCurrentBankName(bankName.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }



  const getbankOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await bankContract.bankOwner();
        setBankOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        const isOwner = (owner.toLowerCase() === account.toLowerCase())
        setIsBankerOwner(isOwner);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const customerBalanceHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let balance = await bankContract.getCustomerBalance();
        setCustomerTotalBalance(utils.formatEther(balance));
        console.log("Retrieved balance...", balance);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }



  useEffect(() => {
    checkIfWalletIsConnected();
    getBankName();
    getbankOwnerHandler();
    customerBalanceHandler()

  })




  return (
    <main className="main-container">
      <h2 className="h2">Treasury Project 💰</h2>

      <section className="customer-section px-10 pt-5 pb-10">
        <ErrorBlock {...{ error }} />
        <BankOwner {...{
          isWalletConnected,
          currentBankName,
          bankOwnerAddress: getAddresWithDic(bankOwnerAddress)
        }} />
        <CustomerInfo {...{
          isWalletConnected,
          customerTotalBalance,
          customerAddress: getAddresWithDic(customerAddress)
        }} />
        <BusyBlock {...{ busy }} />
        <hr></hr>
        <MoveMoney {...{
          isWalletConnected,
          inputValue, handleInputChange,
          customerBalanceHandler, setError, setBusy, busy
        }} />
      </section>
      <AdminPanel {...{
        busy, isWalletConnected, isBankerOwner,
        handleInputChange, inputValue,
        getBankName, setError, setBusy
      }} />

    </main>
  );
}
export default App;


