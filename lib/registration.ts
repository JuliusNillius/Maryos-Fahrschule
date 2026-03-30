const CLASS_KEY = 'maryos-registration-class';
const INSTRUCTOR_KEY = 'maryos-registration-instructor';

export function setRegistrationClass(clazz: string): void {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(CLASS_KEY, clazz);
}

export function getRegistrationClass(): string | null {
  if (typeof window !== 'undefined') return window.sessionStorage.getItem(CLASS_KEY);
  return null;
}

export function setRegistrationInstructor(instructorId: string): void {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(INSTRUCTOR_KEY, instructorId);
}

export function getRegistrationInstructor(): string | null {
  if (typeof window !== 'undefined') return window.sessionStorage.getItem(INSTRUCTOR_KEY);
  return null;
}
