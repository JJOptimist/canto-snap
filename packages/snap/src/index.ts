import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, heading, divider, copyable } from '@metamask/snaps-ui';


async function getCanto() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=canto',
  );
  return response.text();
}

let currentAccount: null = null;

function handleAccountsChanged(accounts: string | any[]) {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    // Do any other necessary setup
  }
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as an object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {

  const { ethereum } = window as any;

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    if (accounts && accounts.length > 0) {
      handleAccountsChanged(accounts);
    } else {
      console.log('Please connect to MetaMask.');
    }
  } catch (error) {
    if ((error as Error).message.includes('User denied')) {
      console.log('Please connect to MetaMask.');
    } else {
      console.error(error);
    }
  }

  switch (request.method) {
    case 'hello':
      return getCanto().then((cantos) => {
        const cantoData = JSON.parse(cantos);
        const cantoPrice = cantoData[0].current_price;
        const priceChange = cantoData[0].price_change_percentage_24h;
        const cantoRank = cantoData[0].market_cap_rank;

        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'confirmation',
            content: panel([
              heading('Canto Snap ©️'),
              text(`Hello, **${origin}**!`),
              text(`🔰 Rank: **${cantoRank}**`),
              text(`💰 Canto Price: **${cantoPrice}** `),
              text(`📈 24h Change: **${priceChange}%**`),
              divider(),
              text(`🛠️ Contribute to **Canto** at:`),
              copyable(`canto.build`),
             
            ]),
          },
        });
      });
  }
}


