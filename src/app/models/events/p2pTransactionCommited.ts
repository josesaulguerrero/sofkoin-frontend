export type p2pTransactionCommited = {
  transactionId: string;
  transactionType: string;
  sellerId: string;
  buyerId: string;
  offerId: string;
  marketId: string;
  cryptoSymbol: string;
  cryptoAmount: number;
  cryptoPrice: number;
  cash: number;
  timestamp: string;
};
