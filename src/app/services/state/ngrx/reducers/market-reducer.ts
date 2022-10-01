import { createReducer, on } from '@ngrx/store';
import { MarketModel } from 'src/app/models/marketmodel';
import { deleteOfferAction } from '../actions/market/deleteOfferAction';
import { getMarketAction } from '../actions/market/getMarketAction';
import { publishOfferAction } from '../actions/market/publishOfferAction';

export const initialMarketState: MarketModel = {
  marketId: '',
  offers: [],
  cryptoSymbols: [],
};

export const marketReducer = createReducer(
  initialMarketState,
  on(
    getMarketAction,
    (_state, marketUpdated): MarketModel => ({ ...marketUpdated })
  ),

  on(
    publishOfferAction,
    (state, { offer }): MarketModel => ({
      ...state,
      offers: [offer, ...state.offers],
    })
  ),

  on(deleteOfferAction, (state, { offer }): MarketModel => {
    const newOffers = state.offers.filter(
      (off) => off.offerId !== offer.offerId
    );

    return {
      ...state,
      offers: newOffers,
    };
  })
);
