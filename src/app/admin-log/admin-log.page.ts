import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication-service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AdminGuardService } from '../shared/admin-guard.service';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.page.html',
  styleUrls: ['./admin-log.page.scss'],
})
export class AdminLogPage implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alert: AlertController,
    private firestore:AngularFirestore,
  ) {

  }

  ngOnInit() {
  }

  logIn(email:any, password:any){
    this.authService
    .SignIn(email.value, password.value)
    .then(async (res) => {
      window.location.reload();
      if (this.authService.isEmailVerified) {
        this.router.navigate(['admin']).then(() => {
          window.location.reload();
        });
      } else {
        const alert = await this.alert.create({
          header: 'Error',
          message: 'Email is not an Admin',
          buttons: ['OK'],
        });
        await alert.present();
        return false;
    }
  })
  }
}