import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state/state.service';
import { ActivitiesList } from 'src/app/models/activitieslist';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  constructor(private state: StateService) {}

  activities?: ActivitiesList[];

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getUserActivity();
  }

  getUserActivity() {
    this.state.user.subscribe((data) => {
      this.activities = data.activities;
    });
  }
}
