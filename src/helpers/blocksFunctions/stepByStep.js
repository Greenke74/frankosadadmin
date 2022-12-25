import { deleteImage, uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (blockData) => {
  const steps = await Promise.all(
    (blockData?.data?.steps ?? [])
      .map(async (step) => {
        const res = { ...step }

        if (step.imageFile) {
          const image = await uploadImage(step.imageFile)
          res.image = image;
          delete res.imageFile;
        }

        if (res.imageUrl) {
          delete res.imageUrl;
        }

        return res;
      })
      .filter(r => Boolean(r))
  )

  const result = { ...blockData };
  result.data.steps = steps;
  return result;
}

export const beforeDelete = async (blockData) => {
  return await Promise.all((blockData?.data?.steps ?? []).map(async (s) => await deleteImage(s?.image)))
}