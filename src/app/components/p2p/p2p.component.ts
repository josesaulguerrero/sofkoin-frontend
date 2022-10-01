import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.css'],
})
export class P2pComponent implements OnInit {
  mainitem?: string;
  sidebaritems?: string[];

  constructor() {}

  ngOnInit(): void {
    this.mainitem = 'p2p';
    this.sidebaritems = ['Active_Offers', 'Publish_Offer', 'Users'];
  }
}
