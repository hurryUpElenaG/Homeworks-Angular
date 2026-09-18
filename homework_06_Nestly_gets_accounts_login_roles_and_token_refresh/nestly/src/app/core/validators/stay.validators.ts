import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Checks whether a value looks like an HTTP/HTTPS URL.*/
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;

  if (!value) {
    // Let Validators.required handle empty values.
    return null;
  }

  const looksLikeUrl = /^https?:\/\/.+/.test(value);

  return looksLikeUrl ? null : { invalidUrl: true };
}

/** Makes sure the stay title and location are not the same.*/
export function titleLocationValidator(group: AbstractControl): ValidationErrors | null {
  const title = group.get('title')?.value?.trim().toLowerCase();
  const location = group.get('location')?.value?.trim().toLowerCase();

  if (title && location && title === location) {
    return { sameAsTitle: true };
  }

  return null;
}
