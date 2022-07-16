import React from "react";
export class BankOwner extends React.PureComponent {

    render() {
        const { currentBankName, bankOwnerAddress, isWalletConnected } = this.props
        const bankName = currentBankName === "" ? "Unnamed bank" : currentBankName
        if (!isWalletConnected) {
            return (
                <div className="mw-50p alert alert-secondary" role="alert" data-mdb-color="secondary">
                    Use MetaMask to connect a wallet!
                </div>
            )
        }
        return (
            <div className="mt-1">
                <span className="mr-5">
                    <strong>Treasury bank name:</strong> {bankName}
                </span>
                <span className="mr-5">
                    <strong>Treasury Owner Address:</strong> {bankOwnerAddress}
                </span>
            </div>
        )
    }
}