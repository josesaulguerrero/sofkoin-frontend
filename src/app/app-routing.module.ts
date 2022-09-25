import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CanActivate } from '@angular/router';
import { AuthGuardService } from './services/authguard/auth-guard.service';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';
import { TradeComponent } from './components/trade/trade.component';
import { TransactionsComponent } from './components/user/transactions/transactions.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ActivityComponent } from './components/user/activity/activity.component';
import { MessagesComponent } from './components/user/messages/messages.component';
import { RechargeComponent } from './components/trade/recharge/recharge.component';
import { BuyComponent } from './components/trade/buy/buy.component';
import { SellComponent } from './components/trade/sell/sell.component';
import { P2pComponent } from './components/p2p/p2p.component';
import { ActiveoffersComponent } from './components/p2p/activeoffers/activeoffers.component';
import { PublishofferComponent } from './components/p2p/publishoffer/publishoffer.component';
import { UsersComponent } from './components/p2p/users/users.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'main', redirectTo: '/main/user/Profile', pathMatch: 'full' },
  { path: 'main/user', redirectTo: '/main/user/Profile', pathMatch: 'full' },
  { path: 'main/trade', redirectTo: '/main/trade/Recharge', pathMatch: 'full' },
  {
    path: 'main/p2p',
    redirectTo: '/main/p2p/Active_Offers',
    pathMatch: 'full',
  },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: 'main',
    component: MainComponent,

    children: [
      {
        path: 'user',
        component: UserComponent,
        children: [
          {
            path: 'Transactions',
            component: TransactionsComponent,
          },
          {
            path: 'Profile',
            component: ProfileComponent,
          },
          {
            path: 'Activity',
            component: ActivityComponent,
          },
          {
            path: 'Messages',
            component: MessagesComponent,
          },
        ],
      },
      {
        path: 'trade',
        component: TradeComponent,
        children: [
          {
            path: 'Recharge',
            component: RechargeComponent,
          },
          {
            path: 'Buy',
            component: BuyComponent,
          },
          {
            path: 'Sell',
            component: SellComponent,
          },
        ],
      },
      {
        path: 'p2p',
        component: P2pComponent,
        children: [
          {
            path: 'Active_Offers',
            component: ActiveoffersComponent,
          },
          {
            path: 'Publish_Offer',
            component: PublishofferComponent,
          },
          {
            path: 'Users',
            component: UsersComponent,
          },
        ],
      },
    ],
    /* canActivate: [AuthGuardService],*/
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
