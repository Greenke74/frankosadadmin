import { deleteImage, uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (blockData) => {
  const result = { ...blockData }

  let imageKey = null;
  if (blockData?.data?.imageFile) {
    imageKey = await uploadImage(blockData.data.imageFile)
    await deleteImage(imageToDelete)

    delete result.data.imageFile;
    result.data.image = imageKey;
  }

  return result;
}