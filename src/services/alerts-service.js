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
  timer: 2500,
  customClass: 'wraningIcon'
})

export const imageRequiredError = () => Swal.fire({
  ...toastSettings,
  icon: 'error',
  title: 'Потрібно додати зображення',
})

export const tryAgainAlert = () => Swal.fire({
  ...toastSettings,
  icon: 'error',
  title: 'Виникла неочікувана помилка!',
  text: 'Спробуйте ще раз',
})

export const blockDeletedAlert = () => Swal.fire({
  ...toastSettings,
  icon: 'success',
  title: 'Блок успішно видалено',
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

export const deleteConfirmAlert = (entity) => Swal.fire({
  title: 'Видалити',
  html: `Ви впевнені, що хочете видалити ${entity.toLowerCase()}?`,
  showCancelButton: true,
  cancelButtonText: 'Скасувати',
  confirmButtonText: 'Видалити',
  focusCancel: true,
  customClass: 'deleteSwal'
})

export const deletedSuccessfullyAlert = (entity) => Swal.fire({
  position: 'top-right',
  icon: 'success',
  title: `${entity} успішно видалено`,
  color: 'var(--theme-color)',
  timer: 3000,
  showConfirmButton: false,
  toast: true,
})

export const alreadyExistsAlert = (entity) => Swal.fire({
  position: 'top-right',
  icon: 'success',
  title: `${entity} з такою назвою уже існує!`,
  color: 'var(--theme-color)',
  timer: 3000,
  showConfirmButton: false,
  toast: true,
})