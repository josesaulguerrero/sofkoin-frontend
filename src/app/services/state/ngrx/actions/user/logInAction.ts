import { createAction, props } from '@ngrx/store';
import { ActivitiesList } from 'src/app/models/activitieslist';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { MessagesList } from 'src/app/models/MessagesList';
import { TransactionsList } from 'src/app/models/transactionList';

export const logInAction = createAction(
  '[Profile page] LogIn',
  props<{
    userId: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    authMethod: string;
    avatarUrl: string;
    currentCash: number;
    messages: MessagesList[];
    cryptos: UserCrypto[];
    activities: ActivitiesList[];
    transactions: TransactionsList[];
  }>()
);
