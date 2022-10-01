import { createReducer, on } from '@ngrx/store';
import { UserModel } from 'src/app/models/UserModel';
import { logInAction } from '../actions/user/logInAction';
import { buyCryptoAction } from '../actions/user/buyCryptoAction';
import { fundAction } from '../actions/user/fundAction';
import { UserCrypto } from '../../../../models/UserCrypto';
import { sellCryptoAction } from '../actions/user/sellCryptoAction';

export const initialUserState: UserModel = {
  userId: '',
  email: '',
  fullName: '',
  phoneNumber: '',
  authMethod: '',
  avatarUrl: '',
  currentCash: 0,
  messages: [],
  cryptos: [],
  activities: [],
  transactions: [],
};

export const userReducer = createReducer(
  initialUserState,

  on(logInAction, (_user, newUser): UserModel => ({ ...newUser })),

  on(
    fundAction,
    (user, { cash }): UserModel => ({
      ...user,
      currentCash: user.currentCash + cash,
    })
  ),

  on(buyCryptoAction, (user, { cash, crypto }): UserModel => {
    const cryptoFound = user.cryptos.find(
      (cryp) => cryp.symbol === crypto.symbol
    );

    const cryptos = user.cryptos.filter(
      (cryp) => cryp.symbol !== crypto.symbol
    );

    const newCryptoAmount = !cryptoFound
      ? crypto.amount
      : cryptoFound.amount + crypto.amount;

    const newCrypto: UserCrypto = {
      symbol: crypto.symbol,
      amount: newCryptoAmount,
      priceUsd: crypto.priceUsd,
    };

    cryptos.push(newCrypto);

    return {
      ...user,
      currentCash: user.currentCash - cash,
      cryptos,
    };
  }),

  on(sellCryptoAction, (user, { cash, crypto }) => {
    const indexCryptoFound = user.cryptos.findIndex(
      (cryp) => cryp.symbol === crypto.symbol
    );

    const crytpoAmount = user.cryptos[indexCryptoFound].amount;

    const newCrypto: UserCrypto = {
      symbol: crypto.symbol,
      amount: crytpoAmount - crypto.amount,
      priceUsd: crypto.priceUsd,
    };

    const cryptos = user.cryptos.filter(
      (cryp) => cryp.symbol !== crypto.symbol
    );

    if (newCrypto.amount !== 0) {
      cryptos.splice(indexCryptoFound, 0, newCrypto);
    }

    return {
      ...user,
      currentCash: user.currentCash + cash,
      cryptos,
    };
  })
);
