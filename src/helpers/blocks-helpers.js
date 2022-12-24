import { updateMainPageBlock, insertMainPageBlock, deleteMainPageBlock } from "../services/main-page-blocks-service";
import { updateBlock, insertBlock, deleteBlock } from '../services/blocks-api-service.js';
import { dataTypes } from "../constants/dataTypes";

export const submitBlock = async (formData, isMainPage) => {
  const payload = {
    ...formData,
    data: formData?.data ?? null,
  };
  dataTypes.forEach(type => {
    if (payload[type] && payload[type] && Array.isArray(payload[type])) {
      const ids = `${type}_ids`
      payload[ids] = payload[type].map(({ value }) => value?.id ?? value?.id ?? undefined).filter(id => Boolean(id))

      delete payload[type];
    }
  })

  if (!formData.id && formData.type) {
    payload.type = formData.type;
  }

  const func = isMainPage
    ? payload.id
      ? updateMainPageBlock
      : insertMainPageBlock
    : payload.id
      ? updateBlock
      : insertBlock


  const response = await func(payload)
  const { data: responseData } = response;

  return {
    ...formData,
    id: responseData?.id ?? payload.id
  }
}


export const sortBlocks = (blocks) => blocks.sort((a, b) => {
  const aPosition = a?.value?.position ?? a?.position ?? 0
  const bPosition = b?.value?.position ?? b?.position ?? 0

  if (aPosition < bPosition) {
    return -1;
  } else if (aPosition > bPosition) {
    return 1
  } else {
    return 0;
  }
})

const beforeBlockSubmitting = async (blockData) => {
  let module = null;
  try {
    module = await import(`./blocksFunctions/${blockData.type}.js`)
  } catch { }
  return (module && module.beforeSubmit)
    ? await module.beforeSubmit(blockData)
    : new Promise((resolve) => resolve(blockData));
}

const beforeBlockDeleting = async (blockData) => {
  let module = null;
  try {
    module = await import(`./blocksFunctions/${blockData.type}.js`)
  } catch { }
  return (module && module.beforeSubmit)
    ? await module.beforeDelete(blockData)
    : new Promise((resolve) => resolve());
}

export const submitBlocks = async (blocks, blocksToDelete, isMainPage = false) => {
  const newBlocksValue = []
  await Promise.all((blocks ?? []).map(async ({ value: block }) => {
    const submitPayload = await beforeBlockSubmitting(block);
    const response = await submitBlock(submitPayload, isMainPage);

    newBlocksValue.push({ value: response })
  }))

  const deleteFunc = isMainPage ? deleteMainPageBlock : deleteBlock
  await Promise.all((blocksToDelete ?? []).map(async block => {
    if (block.id) {
      await beforeBlockDeleting(block)
      await deleteFunc(block.id)
    }
  }))

  return sortBlocks(newBlocksValue);
}