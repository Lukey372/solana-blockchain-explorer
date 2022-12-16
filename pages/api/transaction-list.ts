import type { NextApiRequest, NextApiResponse } from 'next';
import * as solanaWeb3 from '@solana/web3.js';

type Data = {
    data?: {
        transactionList: any;
        accountBalance: any;
    };
    error?: string;
};

const DEV_NET = 'https://api.devnet.solana.com';
const solanaConnection = new solanaWeb3.Connection(DEV_NET);

const getAddressInfo = async (address: string, numTx = 3) => {
    const pubKey = new solanaWeb3.PublicKey(address);
    const transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: numTx });
    const accountBalance = await solanaConnection.getBalance(pubKey);

    return { transactionList, accountBalance };
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const queryAddress = req.query?.address;
    if (!queryAddress) {
        res.status(401).json({
            error: 'Invalid address',
        });
    }
    try {
        const { accountBalance, transactionList } = await getAddressInfo(queryAddress as string);
        res.status(200).json({ data: { transactionList, accountBalance } });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
        });
    }
};

export default handler;
