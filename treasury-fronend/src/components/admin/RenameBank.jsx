import React from "react";
import { ethers, utils } from "ethers";
import abi from "contracts/Bank.json";
import { contractAddress } from 'contracts/contractAddress'
import {
    MDBInputGroup,
    MDBBtn
} from 'mdb-react-ui-kit';
const contractABI = abi.abi;
export class RenameBank extends React.PureComponent {

    render() {
        const { handleInputChange, inputValue, busy, isWalletConnected } = this.props
        if (busy || !isWalletConnected || !inputValue) {
            return null
        }

        return (
            <>
                <section>
                    <div className="bg-white border rounded-5 p-2 mw-350">
                        <MDBInputGroup className='mb-3 '>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleInputChange}
                                name="bankName"
                                placeholder="Enter a Name for Your Bank"
                                value={inputValue.bankName}
                            />
                            <MDBBtn className="renameButton" outline onClick={(e) => { this.setBankNameHandler(e) }}>Rename</MDBBtn>
                        </MDBInputGroup>
                    </div>



                </section>

            </>
        );
    }

    async setBankNameHandler(event) {
        event.preventDefault();
        const { inputValue, getBankName, setError, setBusy } = this.props
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await bankContract.setBankName(utils.formatBytes32String(inputValue.bankName));
                console.log("Setting Bank Name...");
                setBusy("Setting Bank Name...");
                await txn.wait();
                console.log("Bank Name Changed", txn.hash);
                await getBankName();

            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
            setTimeout(() => {
                setError("");
            }, 3000)
        }
        finally {
            setBusy("")
        }
    }


}