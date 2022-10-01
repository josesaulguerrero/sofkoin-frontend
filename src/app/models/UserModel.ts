import { ActivitiesList } from './activitieslist';
import { UserCrypto } from './UserCrypto';
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
  cryptos: UserCrypto[];
  activities: ActivitiesList[];
  transactions: TransactionsList[];
};
