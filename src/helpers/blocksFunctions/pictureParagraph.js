import { deleteImage, uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (blockData) => {
  const result = { ...blockData }

  let imageKey = null;
  if (blockData?.data?.image?.imageFile) {
    imageKey = await uploadImage(blockData?.data?.image?.imageFile)

    result.data.image = { url: imageKey };
  }

  return result;
}

export const beforeDelete = async (blockData) => {
  return await deleteImage(blockData?.data?.image?.url)
}