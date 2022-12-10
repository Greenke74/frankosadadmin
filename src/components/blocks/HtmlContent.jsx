import React, { useRef } from 'react'
import { Controller } from 'react-hook-form';
import HtmlEditor from '../common/HtmlEditor'

const HtmlContent = ({ form }) => {
  const editorRef = useRef(null);

  return (
    <>
      <Controller
        name='data.content'
        control={form.control}
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
    </>
  )
}

export default HtmlContent