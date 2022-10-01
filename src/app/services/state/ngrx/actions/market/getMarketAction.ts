import { createAction, props } from '@ngrx/store';
import { OfferModel } from 'src/app/models/offerModel';

export const getMarketAction = createAction(
  '[P2P page] Get market event',
  props<{
    marketId: string;
    offers: OfferModel[];
    cryptoSymbols: string[];
  }>()
);
