import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, heading, divider, copyable } from '@metamask/snaps-ui';
import jobsvg from './job.svg';
import { image } from '@metamask/snaps-ui';
/**
 * Function to retrieve and display the Ethereum account address.
 *
 * @returns The Ethereum account address.
 */
async function getCanto() {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=canto'); 
  return response.text();
}

const jobs = [
  "EAS 1",
  "EAS 2",
  "EAS 3"
]

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
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return getCanto().then(cantos => {
        
        const cantoData = JSON.parse(cantos);
        const cantoPrice = cantoData[0].current_price;
        const priceChange = cantoData[0].price_change_percentage_24h;
        const cantoRank = cantoData[0].market_cap_rank;
        
      
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Job Stats'),
            text(`Hello, **${origin}**!`),
            image(jobsvg, { width: '100px', height: '100px' }),
            ...jobs.map((job) => text(`Job: **${job}**`)),
            divider(),
            text(`Total Earnings: **$${cantoPrice}**`)

          ]),
        
        },
      });
      });
  }
};
