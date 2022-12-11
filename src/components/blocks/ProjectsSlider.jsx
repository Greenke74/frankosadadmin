import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getProjects } from '../../services/portfolio-api-service.js';
import { getImageSrc } from '../../services/storage-service.js';
import Slider from '../common/Slider.jsx'

const ProjectsSlider = ({ form }, ref) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let mounted = true;

    getProjects().then(response => {
      mounted && setProjects(response)
    })

    return () => mounted = false;
  }, [])


  useImperativeHandle(ref, () => ({
    getBlockData: () => new Promise((resolve) => resolve(form.getValues())),
    onDeleteBlock: () => new Promise((resolve) => { console.log('delete projects slider'); resolve() })
  }))
  return (
    <Slider options={projects} dataType='projects' form={form} />
  )
}

export default forwardRef(ProjectsSlider)