import { OfferModel } from './offerModel';
export type MarketModel = {
  marketId: string;
  offers: OfferModel[];
  cryptoSymbols: string[];
};
