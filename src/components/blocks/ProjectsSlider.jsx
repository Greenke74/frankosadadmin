import React, { useState, useEffect } from 'react'
import { getProjects } from '../../services/portfolio-api-service.js';
import { getImageSrc } from '../../services/storage-service.js';
import Slider from '../common/Slider.jsx'

const ProjectsSlider = ({ form }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let mounted = true;

    getProjects().then(response => {
      mounted && setProjects(response)
    })

    return () => mounted = false;
  }, [])
  return (
    <Slider options={projects} dataType='projects' form={form} />
  )
}

export default ProjectsSlider