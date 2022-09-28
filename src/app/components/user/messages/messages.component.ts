import { Component, OnInit } from '@angular/core';
import { commandChangeMessageStatus } from 'src/app/models/commands/commandChangeMessageStatus';
import { commandPublishP2POffer } from 'src/app/models/commands/commandPublishP2POffer';
import { ErrorModel } from 'src/app/models/errorModel';
import { MessagesList } from 'src/app/models/MessagesList';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  constructor(
    private betaRequest: BetarequestService,
    private alphaRequest: RequestService,
    private state: StateService
  ) {}

  isLoaded: boolean = false;

  messages?: MessagesList[];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getMessages();
  }

  async getMessages() {
    this.betaRequest
      .getUserByIdMethod(localStorage.getItem('userId') as string)
      .subscribe((data) => {
        this.messages = data.messages;
        this.isLoaded = true;
      });
  }

  async acceptOffer(messageId: string) {
    let messageSelected = this.messages?.filter(
      (message) => message.messageId === messageId
    )[0];
    let commandPublishOffer: commandPublishP2POffer = {
      marketId: messageSelected?.marketId as string,
      publisherId: messageSelected?.receiverId as string,
      targetAudienceId: messageSelected?.senderId as string,
      cryptoSymbol: messageSelected?.proposalCryptoSymbol as string,
      offerCryptoAmount: messageSelected?.proposalCryptoAmount as number,
      offerCryptoPrice: messageSelected?.proposalCryptoPrice as number,
    };

    let token: string = localStorage.getItem('token') as string;

    console.log(commandPublishOffer);

    let commandChangeMessageStatus: commandChangeMessageStatus = {
      receiverId: messageSelected?.receiverId as string,
      senderId: messageSelected?.senderId as string,
      messageId: messageSelected?.messageId as string,
      newStatus: 'ACCEPTED',
    };

    this.alphaRequest.publishOfferMethod(commandPublishOffer, token).subscribe({
      next: (response) => {
        console.log(response);

        this.alphaRequest
          .updateMessageMethod(commandChangeMessageStatus, token)
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (err) => {
              console.log(err);
            },
          });
      },
      error: (err: ErrorModel) => {
        alert(err.error.errorMessage);
      },
    });

    console.log(commandChangeMessageStatus);
  }

  async rejectOffer(messageId: string) {
    let messageSelected = this.messages?.filter(
      (message) => message.messageId === messageId
    )[0];

    let token: string = localStorage.getItem('token') as string;

    let commandChangeMessageStatus: commandChangeMessageStatus = {
      receiverId: messageSelected?.receiverId as string,
      senderId: messageSelected?.senderId as string,
      messageId: messageSelected?.messageId as string,
      newStatus: 'REJECTED',
    };

    this.alphaRequest
      .updateMessageMethod(commandChangeMessageStatus, token)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  validateMessageAccepted(
    messageStatus: string,
    messageRelationType: string,
    messageId: string
  ): boolean {
    if (messageStatus === 'PENDING' && messageRelationType === 'RECEIVER') {
      return false;
    }
    return true;
  }

  receiverMessageAccepted(
    messageStatus: string,
    messageRelationType: string,
    messageId: string
  ) {
    if (messageStatus === 'ACCEPTED' && messageRelationType === 'RECEIVER') {
      return true;
    }
    return false;
  }

  receiverMessageRejected(
    messageStatus: string,
    messageRelationType: string,
    messageId: string
  ) {
    if (messageStatus === 'REJECTED' && messageRelationType === 'RECEIVER') {
      return true;
    }
    return false;
  }
}
