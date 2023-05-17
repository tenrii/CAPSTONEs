import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal4Component } from '../modal4/modal4.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Modal2Component } from '../modal2/modal2.component';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss'],
})
export class Modal3Component implements OnInit {
  isButtonDisabled = false;
  roomForm!: FormGroup;
  constructor(
    private service: FirebaseService,
    private m: ModalController,
    private fb: FormBuilder,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.roomForm = this.fb.group({
      RoomType: ['', [Validators.required]],
    });
    console.log('a',this.service.modalData)
  }

  async back() {
    if (this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;

    const previousModal = await this.m.getTop();
    if (previousModal) {
      await previousModal.dismiss();
    }

    const modalInstance = await this.m.create({
      component: Modal2Component,
      cssClass: 'create-modal',
      backdropDismiss: false,
    });

    modalInstance.onDidDismiss().then(() => {
      console.log('Modal 3 dismissed');
      this.isButtonDisabled = false;
    });

    return await modalInstance.present();
  }

  async gotoModal4() {
    if (this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;

    const previousModal = await this.m.getTop();
    if (previousModal) {
      await previousModal.dismiss();
    }

    const modalInstance = await this.m.create({
      component: Modal4Component,
      cssClass: 'create-modal',
      backdropDismiss: false,
    });

    modalInstance.onDidDismiss().then(() => {
      this.service.modalData = {
        ...this.service.modalData,
        RoomType: this.roomForm.get('RoomType')?.value,
      }
      console.log('a',this.service.modalData);
      this.isButtonDisabled = false;
    });

    return await modalInstance.present();
  }
}
