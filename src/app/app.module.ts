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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserComponent } from './components/user/user.component';
import { TradeComponent } from './components/trade/trade.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ActivityComponent } from './components/activity/activity.component';
import { MessagesComponent } from './components/messages/messages.component';

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
  ],

  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
