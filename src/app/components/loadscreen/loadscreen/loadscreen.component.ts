import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loadscreen',
  templateUrl: './loadscreen.component.html',
  styleUrls: ['./loadscreen.component.css'],
})
export class LoadscreenComponent implements OnInit {
  constructor() {}

  @Input() isLoaded: boolean = false;
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
