import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';

/**
 * Function to retrieve and display the Ethereum account address.
 *
 * @returns The Ethereum account address.
 */
async function displayEthereumAddress() {
  try {
    // Request Ethereum account access from Metamask
    await ethereum.request({ method: 'eth_requestAccounts' });

    // Get the Ethereum account address
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const ethereumAddress = accounts[0];

    // Display the Ethereum address using Snaps UI components
    return snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading('Ponte Snap'),
          text(`Hello, **${origin}**!`),
          text(`This is your Ethereum address: ${ethereumAddress}`),
        ]),
      },
    });
  } catch (error) {
    throw new Error('Failed to retrieve Ethereum address');
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
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Ponte Snap'),
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
          ]),
        },
      });
  }
};
