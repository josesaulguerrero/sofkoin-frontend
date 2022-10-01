import { createAction, props } from '@ngrx/store';
import { UserCrypto } from 'src/app/models/UserCrypto';

export const buyCryptoAction = createAction(
  '[Buy page] Buy event',
  props<{
    cash: number;
    crypto: UserCrypto;
  }>()
);
