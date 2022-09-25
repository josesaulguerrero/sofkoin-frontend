import { ActivitiesList } from './activitieslist';
import { UserCryptosList } from './CryptoUsrList';
import { TransactionsList } from './transactionList';
import { MessagesList } from './MessagesList';
export type UserModel = {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  currentCash: string;
  messages: MessagesList[];
  cryptos: UserCryptosList[];
  activities: ActivitiesList[];
  transactions: TransactionsList[];
};
