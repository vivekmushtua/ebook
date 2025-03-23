import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-snackbar',
  imports: [SharedModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})

export class SnackbarComponent implements OnInit {
    constructor(
      public snackBarRef: MatSnackBarRef<SnackbarComponent>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) {}

    ngOnInit(): void {
    }

    closeSnackbar() {
      this.snackBarRef.dismiss();
    }

}