import { ActivitiesList } from './activitieslist';
import { UserCryptosList } from './CryptoUsrList';
import { TransactionsList } from './transactionList';
import { MessagesList } from './MessagesList';
export type UserModel = {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  authMethod: string;
  avatarUrl: string;
  currentCash: number;
  messages: MessagesList[];
  cryptos: UserCryptosList[];
  activities: ActivitiesList[];
  transactions: TransactionsList[];
};
