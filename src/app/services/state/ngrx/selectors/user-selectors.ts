import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserModel } from 'src/app/models/UserModel';

export const selectUser = createFeatureSelector<UserModel>('user');

export const selectProfileUserData = createSelector(
  selectUser,
  (state: UserModel) => ({
    fullName: state.fullName,
    avatarUrl: state.avatarUrl,
    email: state.email,
    phoneNumber: state.phoneNumber,
    currentCash: state.currentCash,
    cryptos: state.cryptos,
  })
);

export const selectUserCash = createSelector(
  selectUser,
  (state: UserModel) => state.currentCash
);

export const selectUserCryptos = createSelector(
  selectUser,
  (state: UserModel) => state.cryptos
);
