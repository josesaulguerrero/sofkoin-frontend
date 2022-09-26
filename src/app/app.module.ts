import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { UserComponent } from './components/user/user.component';
import { TradeComponent } from './components/trade/trade.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { TransactionsComponent } from './components/user/transactions/transactions.component';
import { ActivityComponent } from './components/user/activity/activity.component';
import { MessagesComponent } from './components/user/messages/messages.component';
import { P2pComponent } from './components/p2p/p2p.component';
import { RechargeComponent } from './components/trade/recharge/recharge.component';
import { BuyComponent } from './components/trade/buy/buy.component';
import { SellComponent } from './components/trade/sell/sell.component';
import { ActiveoffersComponent } from './components/p2p/activeoffers/activeoffers.component';
import { PublishofferComponent } from './components/p2p/publishoffer/publishoffer.component';
import { UsersComponent } from './components/p2p/users/users.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuardService } from './services/authguard/auth-guard.service';
import { SingleuserComponent } from './components/p2p/users/singleuser/singleuser.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    UserComponent,
    TradeComponent,
    ProfileComponent,
    TransactionsComponent,
    ActivityComponent,
    MessagesComponent,
    P2pComponent,
    RechargeComponent,
    BuyComponent,
    SellComponent,
    ActiveoffersComponent,
    PublishofferComponent,
    UsersComponent,
    WelcomeComponent,
    SingleuserComponent,
  ],

  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AppRoutingModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
