import { createAction, props } from '@ngrx/store';
import { OfferModel } from 'src/app/models/offerModel';

export const publishOfferAction = createAction(
  '[P2P page] publish offer event',
  props<{
    offer: OfferModel;
  }>()
);
