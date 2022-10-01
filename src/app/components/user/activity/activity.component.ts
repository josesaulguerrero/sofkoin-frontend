import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state/state.service';
import { ActivitiesList } from 'src/app/models/activitieslist';
import { BetarequestService } from 'src/app/services/request/betarequest.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  constructor(private betaRequest: BetarequestService) {}

  activities?: ActivitiesList[];
  isLoaded: boolean = false;

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getUserActivities();
  }

  async getUserActivities() {
    this.betaRequest
      .getUserByIdMethod(localStorage.getItem('userId') as string)
      .subscribe((data) => {
        this.activities = data.activities.reverse();
        this.isLoaded = true;
      });
  }
}
