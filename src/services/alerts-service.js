import Swal from "sweetalert2";
import '../styles/swal.scss';

const toastSettings = {
  position: 'top-right',
  timer: 5000,
  toast: true,
  showConfirmButton: false,
  color: 'var(--theme-color)'
}

export const changesSavedAlert = () => Swal.fire({
  ...toastSettings,
  icon: 'success',
  title: 'Зміни збережено',
})

export const checkErrorsAlert = () => Swal.fire({
  ...toastSettings,
  icon: 'warning',
  title: 'Перевірте введені дані',
  customClass: 'wraningIcon'
})

export const imageRequiredError = () => Swal.fire({
  ...toastSettings,
  icon: 'error',
  title: 'Потрібно додати зображення',
})

export const unsavedChanges = () => Swal.fire({
  title: 'У вас є незбережені зміни',
  text: 'Зберегти їх?',
  showCancelButton: true,
  cancelButtonText: '  Ні  ',
  confirmButtonText: 'Так',
  customClass: 'saveChanges',
  focusConfirm: true,
  allowOutsideClick: false
})