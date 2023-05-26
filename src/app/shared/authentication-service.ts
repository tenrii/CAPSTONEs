import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { User } from '../shared/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  uid: any;
  constructor(
    public m: ModalController,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    });
  }
  // Login in with email/password
  SignIn(email:any, password:any) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  async SendVerificationMailT() {
    const user:any = await this.ngFireAuth.currentUser;
    await user.sendEmailVerification();
  }

  async RegisterUserTenant(email: any, password: any, record: any) {
    try {
      const { user }:any = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    await this.SendVerificationMailT();

      const uid = user.uid;
      await this.afStore.collection('Tenant').doc(uid).set({
        uid: uid,
        Email: record.Email,
        FName: record.FName,
        LName: record.LName,
        Age: record.Age,
        Address: record.Address,
      });

      await this.m.dismiss();
      await this.router.navigate(['owner-panel']);
      return user;
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  }


  async RegisterUserOwner(email: any, password: any, record: any) {
    const register = this.ngFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        const uid = data.user?.uid;
        this.afStore.doc('Owner/' + uid).set({
          uid: uid,
          Email: record.Email,
          FName: record.FName,
          LName: record.LName,
          Age: record.Age,
          Address: record.Address,
        });
      });
    return register;
  }
  // Email verification when new user register

  SendVerificationMailO() {
    return this.ngFireAuth.currentUser.then((user: any) => {
      return user.sendEmailVerification().then(() => {
        this.router.navigate(['owner-panel']).then(() => {
          this.m.dismiss().then(() => {
            window.location.reload();
          });
        });
      });
    });
  }
  // Recover password
  PasswordRecover(passwordResetEmail: any) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent, please check your inbox.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.emailVerified !== false ? true : false;
  }
  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth providers
  AuthLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']).then(() => {
            window.location.reload();
          });
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Store user in localStorage
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']).then(() => {
        window.location.reload();
      });
    });
  }
}
