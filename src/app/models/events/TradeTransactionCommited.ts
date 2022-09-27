export type TradeTransactionCommited = {
  transactionId: string;
  buyerId: string;
  transactionType: string;
  cryptoSymbol: string;
  cryptoAmount: number;
  cryptoPrice: number;
  cash: number;
  timestamp: string;
};
