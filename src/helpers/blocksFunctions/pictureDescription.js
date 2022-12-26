import { deleteImage, uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (blockData) => {
  const result = { ...blockData }

  let imageKey = null;
  if (blockData?.data?.imageFile) {
    imageKey = await uploadImage(blockData?.data?.imageFile)

    delete result?.data?.imageFile;
    // delete result?.data?.imageSrc;
    delete result?.data?.imageUrl;

    result.data.image = imageKey;
  }

  return result;
}

export const beforeDelete = async (blockData) => {
  return await deleteImage(blockData?.data.image)
}