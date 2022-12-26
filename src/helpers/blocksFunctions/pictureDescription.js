import { deleteImage, uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (blockData) => {
  const result = { ...blockData }

  let imageKey = null;
  if (blockData?.data?.imageFile) {
    imageKey = await uploadImage(blockData.data.imageFile)

    delete result.data.imageFile;
    result.data.image = imageKey;
  }

  console.log(result);
  return result;
}

export const beforeDelete = async (blockData) => {
  return await deleteImage(blockData?.data.image)
}