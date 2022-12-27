import React, { useRef } from 'react'
import { Controller } from 'react-hook-form';
import ErrorMessage from '../common/ErrorMessage';
import HtmlEditor from '../common/HtmlEditor'

const HtmlContent = ({
  registerName,
  register,
  control,
  errors
}) => {
  const editorRef = useRef(null);

  return (
    <>
      <Controller
        name={`${registerName}.data.content`}
        control={control}
        rules={{ required: true, maxLength: 10000 }}
        render={({ field }) => (
          <HtmlEditor
            onInit={(evt, editor) => editorRef.current = editor}
            value={field.value}
            onChange={(value) => {
              field.onChange(value)
            }}
          />
        )}
      />
      {errors && errors?.data?.content && (
        <ErrorMessage
          type={errors?.data?.content?.type}
          maxLength={errors?.data?.content?.type == 'maxLength' ? 10000 : null}
        />
      )}
    </>
  )
}

export default HtmlContent;