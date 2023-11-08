import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Accounts } from './accounts.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

const BACKEND_URL = environment.apiUrl + '/accounts/';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private accounts: Accounts[] = [];
  private accountsUpdated = new Subject<{
    accounts: Accounts[];
    accountCount: number;
  }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getAccounts(accountsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${accountsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: String; accounts: any; maxAccounts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((accountData) => {
          return {
            accounts: accountData.accounts.map((account) => {
              return {
                id: account._id,
                email: account.email,
                firstname: account.firstname,
                lastname: account.lastname,
                contactnumber: account.contactnumber,
                city: account.city,
                province: account.province,
                bls: account.bls,
                subdivision: account.subdivision,
                postalcode: account.postalcode,
                imagePath: account.imagePath,
                birthday: account.birthday,
                discountType: account.discountType,
                discountStatus: account.discountStatus
              };
            }),
            maxAccounts: accountData.maxAccounts,
          };
        })
      )
      .subscribe((transformedAccountData) => {
        console.log(transformedAccountData);
        this.accounts = transformedAccountData.accounts;
        this.accountsUpdated.next({
          accounts: [...this.accounts],
          accountCount: transformedAccountData.maxAccounts,
        });
      });
  }

  getAccountUpdateListener() {
    return this.accountsUpdated.asObservable();
  }

  getAccount(id: String) {
    return this.httpClient.get<{
      password: string;
      _id: string;
      email: string;
      firstname: string;
      lastname: string;
      contactnumber: string;
      city: string;
      province: string;
      bls: string;
      subdivision: string;
      postalcode: string;
      role: string;
      imagePath: string;
      birthday: Date | string;
      discountType: string;
      discountStatus: string;
    }>(BACKEND_URL + id);
  }

  updateDiscount(id: string, discountType: string, discountStatus: string) {
    const discountData = {
        discountType: discountType,
        discountStatus: discountStatus
    };

    this.httpClient.put(BACKEND_URL + id, discountData)
        .subscribe(response => {
            this.router.navigate(["/admin/accounts"]);
        });
}
}

