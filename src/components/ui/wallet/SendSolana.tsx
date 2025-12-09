"use client";

import { useCallback, useState } from "react";
import { useConnection as useSolanaConnection, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Button } from "../Button";
import { truncateAddress } from "../../../lib/truncateAddress";
import { renderError } from "../../../lib/errorUtils";

/**
 * Props for the SendSolana component
 */
export interface SendSolanaProps {
  /** Recipient Solana wallet address (base58 string) */
  recipient: string;
  /** Amount to send in SOL (will be converted to lamports) */
  amount: number;
  /** Optional button text override */
  buttonText?: string;
}

/**
 * SendSolana component handles sending SOL transactions on Solana.
 * 
 * This component provides a simple interface for users to send SOL transactions
 * using their connected Solana wallet. It includes transaction status tracking
 * and error handling.
 * 
 * Features:
 * - SOL transaction sending with dynamic recipient and amount
 * - Transaction status tracking
 * - Error handling and display
 * - Loading state management
 * 
 * @example
 * ```tsx
 * <SendSolana 
 *   recipient="Ao3gLNZAsbrmnusWVqQCPMrcqNi6jdYgu8T6NCoXXQu1" 
 *   amount={0.1} 
 * />
 * ```
 */
export function SendSolana({ recipient, amount, buttonText = "Send Transaction (sol)" }: SendSolanaProps) {
  const [solanaTransactionState, setSolanaTransactionState] = useState<
    | { status: 'none' }
    | { status: 'pending' }
    | { status: 'error'; error: Error }
    | { status: 'success'; signature: string }
  >({ status: 'none' });

  const { connection: solanaConnection } = useSolanaConnection();
  const { sendTransaction, publicKey } = useSolanaWallet();

  /**
   * Converts SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
   */
  const solToLamports = (sol: number): bigint => {
    return BigInt(Math.floor(sol * 1_000_000_000));
  };

  /**
   * Handles sending the Solana transaction
   */
  const sendSolanaTransaction = useCallback(async () => {
    setSolanaTransactionState({ status: 'pending' });
    try {
      if (!publicKey) {
        throw new Error('no Solana publicKey');
      }

      if (!recipient) {
        throw new Error('recipient address is required');
      }

      if (amount <= 0) {
        throw new Error('amount must be greater than 0');
      }

      // Validate recipient address
      try {
        new PublicKey(recipient);
      } catch {
        throw new Error('invalid recipient address');
      }

      const { blockhash } = await solanaConnection.getLatestBlockhash();
      if (!blockhash) {
        throw new Error('failed to fetch latest Solana blockhash');
      }

      const fromPubkeyStr = publicKey.toBase58();
      const lamports = solToLamports(amount);
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(fromPubkeyStr),
          toPubkey: new PublicKey(recipient),
          lamports: lamports,
        }),
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(fromPubkeyStr);

      const simulation = await solanaConnection.simulateTransaction(transaction);
      if (simulation.value.err) {
        // Gather logs and error details for debugging
        const logs = simulation.value.logs?.join('\n') ?? 'No logs';
        const errDetail = JSON.stringify(simulation.value.err);
        throw new Error(`Simulation failed: ${errDetail}\nLogs:\n${logs}`);
      }
      const signature = await sendTransaction(transaction, solanaConnection);
      setSolanaTransactionState({ status: 'success', signature });
    } catch (e) {
      if (e instanceof Error) {
        setSolanaTransactionState({ status: 'error', error: e });
      } else {
        setSolanaTransactionState({ status: 'none' });
      }
    }
  }, [sendTransaction, publicKey, solanaConnection, recipient, amount]);

  return (
    <>
      <Button
        onClick={sendSolanaTransaction}
        disabled={solanaTransactionState.status === 'pending'}
        isLoading={solanaTransactionState.status === 'pending'}
        className="mb-4"
      >
        {buttonText}
      </Button>
      {solanaTransactionState.status === 'error' && renderError(solanaTransactionState.error)}
      {solanaTransactionState.status === 'success' && (
        <div className="mt-2 text-xs">
          <div>Hash: {truncateAddress(solanaTransactionState.signature)}</div>
        </div>
      )}
    </>
  );
} 