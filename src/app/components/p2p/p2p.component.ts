import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.css'],
})
export class P2pComponent implements OnInit {
  constructor() {}
  mainitem?: string;
  sidebaritems?: string[];
  ngOnInit(): void {
    this.mainitem = 'p2p';
    this.sidebaritems = ['Active_Offers', 'Publish_Offer', 'Users'];
  }
}
