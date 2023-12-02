import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

const BACKEND_URL = environment.apiUrl + '/user/';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent {
  private unsubscribe$ = new Subject<boolean>();

  isLoading = true;

  constructor(
    private route: ActivatedRoute, private http: HttpClient
  ) {
    this.route.params.subscribe(params => {
    const userId = params['userId']; // Get userId from URL
    this.verifyUser(userId);

});

}

verifyUser(userId: string) {
    this.http.get(BACKEND_URL + `verify/${userId}`)
        .subscribe(response => {
            // Handle response here (e.g., show a success message)
        }, error => {
            // Handle error here (e.g., show an error message)
        });
}
}