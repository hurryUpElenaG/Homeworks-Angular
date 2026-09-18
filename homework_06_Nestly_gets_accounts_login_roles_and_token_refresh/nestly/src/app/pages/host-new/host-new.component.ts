import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StaysService } from '../../core/services/stays.service';
import { NewStay } from '../../core/models/new-stay.model';
import { titleLocationValidator, urlValidator } from '../../core/validators/stay.validators';

@Component({
  selector: 'app-host-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './host-new.component.html',
  styleUrl: './host-new.component.css',
})
export class HostNewComponent {
  private readonly fb = inject(FormBuilder);
  private readonly staysService = inject(StaysService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group(
    {
      title: ['', [Validators.required, Validators.minLength(5)]],
      location: ['', [Validators.required]],
      pricePerNight: [null, [Validators.required, Validators.min(10), Validators.max(5000)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      superhost: [false],
      photos: this.fb.array([this.createPhotoControl()]),
    },
    {
      validators: titleLocationValidator,
    },
  );

  /**
   * Convenient getter for the photos FormArray.
   */
  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }

  /**
   * Creates one photo URL control.
   */
  private createPhotoControl() {
    return this.fb.control('', [Validators.required, urlValidator]);
  }

  /**
   * Adds another photo input.
   */
  addPhoto(): void {
    this.photos.push(this.createPhotoControl());
  }

  /**
   * Removes a photo input.
   * At least one photo must always remain.
   */
  removePhoto(index: number): void {
    if (this.photos.length <= 1) {
      return;
    }

    this.photos.removeAt(index);
  }

  /**
   * Returns whether a control should display its validation errors.
   */
  showError(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /**
   * Submits the form.
   */
  submit(): void {
    this.submitError.set(null);

    // Make sure validation messages become visible.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.getRawValue();

    const newStay: NewStay = {
      title: formValue.title.trim(),
      location: formValue.location.trim(),
      pricePerNight: Number(formValue.pricePerNight),
      description: formValue.description.trim(),
      superhost: formValue.superhost,
      photos: formValue.photos,
    };

    this.staysService.createStay(newStay).subscribe({
      next: (createdStay) => {
        this.isSubmitting.set(false);

        // Navigate to the Homework 2 detail route.
        this.router.navigate(['/stays', createdStay.id]);
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to create stay:', error);

        this.isSubmitting.set(false);

        this.submitError.set(
          'We could not create your stay. Please make sure the Nestly server is running and try again.',
        );
      },
    });
  }

  /**
   * Cancel and return to the stays list.
   */
  cancel(): void {
    this.router.navigate(['/']);
  }
}
