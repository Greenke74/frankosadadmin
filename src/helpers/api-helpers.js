import { updateMainPageBlock, insertMainPageBlock } from "../services/main-page-blocks-service";
import { updateBlock, insertBlock } from '../services/blocks-api-service.js';
import { dataTypes } from "../constants/dataTypes";

export const submitBlock = async (formData, isMainPage) => {
    const payload = {
      ...formData,
      data: formData?.data ?? null,
    };
    dataTypes.forEach(type => {
      if (payload[type]) {
        delete payload[type];
      }
      const ids = `${type}_ids`
      if (payload[ids] && Array.isArray(payload[ids])) {
        payload[ids] = payload[ids].map((id) => id?.value ?? id ?? undefined).filter(id => Boolean(id))
      }
    })

    if (!formData.id && data.type) {
      payload.type = data.type;
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