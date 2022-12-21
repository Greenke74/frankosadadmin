import { uploadImage } from "../../services/storage-service";

export const beforeSubmit = async (data) => {
  const steps = await Promise.all(
    (data?.data?.steps ?? [])
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

  const result = { ...formData };
  result.data.steps = steps;
  return result;
}