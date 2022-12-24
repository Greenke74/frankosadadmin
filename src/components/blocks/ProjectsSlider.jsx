import React, { useState, useEffect } from 'react'
import { getProjects } from '../../services/portfolio-api-service.js';
import { getImageSrc } from '../../services/storage-service.js';
import Slider from '../common/Slider.jsx'

const ProjectsSlider = (props) => {

  return (
    <Slider options={props.projects} dataType='projects' {...props} />
  )
}

export default ProjectsSlider