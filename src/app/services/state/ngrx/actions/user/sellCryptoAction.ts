import { createAction, props } from '@ngrx/store';
import { UserCrypto } from 'src/app/models/UserCrypto';

export const sellCryptoAction = createAction(
  '[Sell page] Sell event',
  props<{
    cash: number;
    crypto: UserCrypto;
  }>()
);
