import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'
import * as Web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const SendSolForm: FC = () => {
    const [txSig, setTxSig] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

    const sendSol = event => {
        event.preventDefault()
        const amount = event.target.amount.value
        const recipientAddress = event.target.recipient.value
        console.log(`Send ${amount} SOL to ${recipientAddress}`)
        const recipientPublicKey = new Web3.PublicKey(recipientAddress)
        const transaction = new Web3.Transaction()
        const instruction = Web3.SystemProgram.transfer(
            {
                fromPubkey: publicKey,
                toPubkey: recipientPublicKey,
                lamports: LAMPORTS_PER_SOL * amount
            }
        )
        transaction.add(instruction)
        sendTransaction(transaction, connection).then(signature => {
            setTxSig(signature)
        })
    }

    return (
        <div>
            {
                publicKey ?
                    <form onSubmit={sendSol} className={styles.form}>
                        <label htmlFor="amount">Amount (in SOL) to send:</label>
                        <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                        <br />
                        <label htmlFor="recipient">Send SOL to:</label>
                        <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                        <button type="submit" className={styles.formButton}>Send</button>
                    </form> :
                    <span>Connect to Wallet</span>
            }
            {
                txSig ?
                    <div>
                        <p>View your transaction on </p>
                        <a href={link()}>Solana Explorer</a>
                    </div> :
                    null
            }
        </div>
    )
}