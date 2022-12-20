export const validateForm = async (form) => {
  let isValid = true;

  if (Object.keys(form.formState.errors ?? {}).length > 0) {

    isValid = false;
  } else {
    isValid = await form.trigger(Object.keys(form.getValues() ?? {}))
  }

  return isValid;
}