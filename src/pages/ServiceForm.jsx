import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { Box, Alert, FormControl, FormControlLabel, Grid } from "@mui/material";

import {
  StyledCheckbox,
  StyledInputBase,
  StyledInputLabel,
} from "../components/common/StyledComponents";
import ImageUploader from "../components/common/ImageUploader";
import ErrorMessage from "../components/common/ErrorMessage";
import Tabs from "../components/common/Tabs";
import BlocksComposition from "../components/BlocksComposition";
import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import TabPanel from "../components/common/TabPanel";
import ImageCard from "../components/common/ImageCard";

import {
  getServicePage,
  insertService,
  updateService,
} from "../services/services-api-service";
import {
  deleteImage,
  getImageSrc,
  uploadImage,
} from "../services/storage-service.js";
import {
  alreadyExistsAlert,
  changesSavedAlert,
  checkErrorsAlert,
} from "../services/alerts-service";

import { slugify } from "transliteration";
import { getSrcFromFile } from "../helpers/file-helpers";
import { serviceBlocks } from "../components/blocks/index.js";
import { sortBlocks, submitBlocks } from "../helpers/blocks-helpers";
import { v1 as uuid } from "uuid";

const IMAGE_ASPECT_RATIO = 2 / 1;

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const [imageToDelete, setImageToDelete] = useState(null);
  const [blocksToDelete, setBlocksToDelete] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      alias: "",
      image: {
        image: "",
        imageSrc: "",
        imageFile: null,
      },
      is_published: true,
      blocks: [],
    },
    mode: "onSubmit",
  });
  const {
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = form;

  const blocksFieldArray = useFieldArray({ control: control, name: "blocks" });

  const is_published = watch("is_published");

  useEffect(() => {
    let mounted = true;
    !isNaN(id) &&
      getServicePage(id).then(({ data: service }) => {
        const formData = {
          ...getValues(),
          ...service,
          image: {
            image: service.image,
            imageSrc: "",
            imageFile: null,
          },
          blocks: sortBlocks(service.blocks ?? []).map((b) => ({ value: b })),
        };
        reset(formData);
        mounted && setInitialValues(formData);
      });

    return () => (mounted = false);
  }, [id]);

  const onDeleteBlock = (block) =>
    setBlocksToDelete((prev) => [...prev, block]);

  const onSubmit = async (data) => {
    const { blocks: formBlocks } = data;
    setIsSubmitting(true);

    const blocks = await submitBlocks(
      formBlocks,
      blocksToDelete,
      imagesToDelete
    );

    const { title } = data;

    const payload = {
      ...initialValues,
      ...data,
      alias: slugify(title.trim()?.slice(0, 75), { replace: [[".", "-"]] }),
      blocks_ids: blocks.map((b) => b.value.id),
    };

    let imageKey = null;
    if (data?.image?.imageFile) {
      imageKey = await uploadImage(data.image?.imageFile);
      await deleteImage(imageToDelete);

      delete payload.imageFile;
      payload.image = imageKey;
    } else {
      payload.image = payload.image.image;
    }

    if (JSON.stringify(payload) !== JSON.stringify(initialValues)) {
      delete payload.blocks;

      try {
        if (payload.id) {
          await updateService(payload);

          setValue("imageFile", null);

          changesSavedAlert();
        } else {
          const {
            data: { id },
          } = await insertService(payload);
          setValue("imageFile", null);

          navigate(`/services/${id}`);
          changesSavedAlert();
        }
      } catch (error) {
        if (error?.includes("duplicate key value violates unique constraint")) {
          alreadyExistsAlert("Послуга");
        }
        if (imageKey) {
          await deleteImage(imageKey);
        }
        return;
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
      }
      if (imageToDelete) {
        await deleteImage(imageToDelete);
        setImageToDelete(null);
      }

      delete payload.blocks_ids;
      const newFormData = {
        ...payload,
        image: {
          image: payload.image ?? data.image,
          imageSrc: "",
          imageFile: null,
        },
        blocks: blocks,
      };
      setInitialValues(newFormData);
      form.reset(newFormData);

      setBlocksToDelete([]);
      setImagesToDelete([]);

      setIsSubmitting(false);
    }
  };

  const onError = (errors) => {
    const generalInfoErrors = { ...errors };
    if (generalInfoErrors?.blocks) {
      delete generalInfoErrors.blocks;
    }
    setCurrentTab(Object.keys(generalInfoErrors).length > 0 ? 0 : 1);
    checkErrorsAlert();
  };

  const appendImageToDelete = (id) =>
    setImagesToDelete((prev) => [...prev, id]);

  const generalInfoErrors = { ...errors };
  if (generalInfoErrors?.blocks) {
    delete generalInfoErrors.blocks;
  }

  return (
    <>
      <PageHeader
        title={isNaN(id) ? "Створення нової послуги" : "Редагування послуги"}
        onSubmit={handleSubmit(onSubmit, onError)}
        submitDisabled={isSubmitting}
        onGoBack={() => navigate("/services")}
      />
      <Page>
        <Box padding={2}>
          <Tabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={[
              {
                label: "Загальна інформація",
                errors: generalInfoErrors,
              },
              {
                label: "Сторінка послуги",
                errors: errors?.blocks,
              },
            ]}
          >
            <TabPanel index={0} currentTab={currentTab}>
              <Box bgcolor="#dedede52" padding={2} borderRadius="8px">
                <Box
                  display="flex"
                  paddingLeft={1}
                  flexWrap="nowrap"
                  height="100%"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <StyledCheckbox
                        checked={is_published}
                        onChange={(e) =>
                          setValue("is_published", e.target.checked)
                        }
                      />
                    }
                    label={"Опублікувати"}
                  />
                  {is_published ? (
                    <Alert severity="success">
                      Ця послуга відображатиметься на сторінці "Послуги"
                    </Alert>
                  ) : (
                    <Alert severity="info">
                      Цю послугу буде збережено як чернетку
                    </Alert>
                  )}
                </Box>
              </Box>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={12} lg={7}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel shrink htmlFor="titleInput">
                        Заголовок послуги
                      </StyledInputLabel>
                      <StyledInputBase
                        error={!!errors?.title}
                        placeholder="Заголовок послуги"
                        id="titleInput"
                        {...register("title", {
                          required: true,
                          maxLength: 50,
                        })}
                      />
                    </FormControl>
                    {errors.title && (
                      <ErrorMessage
                        type={errors?.title?.type}
                        maxLength={
                          errors?.title?.type === "maxLength" ? 50 : undefined
                        }
                      />
                    )}
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel shrink htmlFor="descriptionInput">
                        Опис
                      </StyledInputLabel>
                      <StyledInputBase
                        error={!!errors?.description}
                        placeholder="Опис"
                        id="descriptionInput"
                        multiline={true}
                        minRows={6}
                        maxRows={20}
                        {...register("description", {
                          required: true,
                          maxLength: 2000,
                        })}
                      />
                    </FormControl>
                    {errors.description && (
                      <ErrorMessage
                        type={errors?.description?.type}
                        maxLength={
                          errors?.description?.type === "maxLength"
                            ? 2000
                            : undefined
                        }
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "fit-content",
                      margin: "auto",
                    }}
                  >
                    <StyledInputLabel
                      required
                      shrink
                      htmlFor="imageUploader"
                      sx={{ alignSelf: "start" }}
                    >
                      Зображення
                    </StyledInputLabel>
                    <Controller
                      name={`image`}
                      control={control}
                      rules={{
                        validate: (value) =>
                          value?.image
                            ? Boolean(value.image)
                            : Boolean(value.imageUrl) || "imageRequired",
                      }}
                      render={({ field }) => {
                        return (
                          <>
                            <ImageCard
                              src={
                                field.value.image
                                  ? getImageSrc(field.value.image)
                                  : field.value.imageUrl ?? null
                              }
                              onClickDelete={() => {
                                field.value.image &&
                                  setImageToDelete(field.value.image);
                                field.onChange({
                                  ...field.value,
                                  imageFile: null,
                                  imageSrc: "",
                                  image: "",
                                });
                              }}
                              ratio={IMAGE_ASPECT_RATIO}
                              error={errors && errors.image}
                              customDivideBy={9}
                            />
                            <Box sx={{ mb: 2, mt: 1, width: "315px" }}>
                              {errors && errors.image && (
                                <ErrorMessage type="imageRequired" />
                              )}
                            </Box>
                            <ImageUploader
                              id={`${uuid()}-image-uploader`}
                              ratio={IMAGE_ASPECT_RATIO}
                              onChange={async (file) => {
                                if (file) {
                                  field.onChange({
                                    ...field.value,
                                    image: null,
                                    imageUrl: await getSrcFromFile(file),
                                    imageFile: file,
                                  });
                                }
                              }}
                              buttonDisabled={
                                field.value.imageUrl || field.value.image
                              }
                            />
                          </>
                        );
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel index={1} currentTab={currentTab}>
              <BlocksComposition
                fieldArray={blocksFieldArray}
                allowedBlocks={serviceBlocks}
                form={form}
                onDeleteBlock={onDeleteBlock}
                appendImageToDelete={appendImageToDelete}
              />
            </TabPanel>
          </Tabs>
        </Box>
      </Page>
    </>
  );
};

export default ServiceForm;
