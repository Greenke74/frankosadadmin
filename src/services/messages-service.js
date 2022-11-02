export const errorMessages = {
    required: 'Це поле потрібно заповнити',
    minLength: (minLength) => `Потрібно ввести не менше ${minLength} символів`,
    maxLength: (maxLength) => `Можна ввести не більше ${maxLength} символів`,
    min: (min) => `Це поле повинно бути більшим за ${min}`,
    max: (max) => `Це поле повинно бути меншим за ${max}`,
    urlPattern: 'Неправильний формат посилання',
    emailPattern: 'Неправильний формат електронної пошти',
    phonePattern: 'Неправильний формат номера телефону'
}