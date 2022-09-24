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
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ActivityComponent } from './components/activity/activity.component';
import { MessagesComponent } from './components/messages/messages.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'main', redirectTo: '/main/user', pathMatch: 'full' },

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
