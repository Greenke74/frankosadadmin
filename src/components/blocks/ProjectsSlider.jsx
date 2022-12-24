import React from 'react'
import Slider from '../common/Slider.jsx'

const ProjectsSlider = (props) =>
  <Slider options={props.projects} dataType='projects' {...props} />

export default ProjectsSlider