import { createAction, props } from '@ngrx/store';
import { OfferModel } from 'src/app/models/offerModel';

export const deleteOfferAction = createAction(
  '[P2P page] Delete offer event',
  props<{
    offer: OfferModel;
  }>()
);
