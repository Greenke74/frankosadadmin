import React, { useState, useEffect } from 'react'
import { getServices } from '../../services/services-api-service.js'
import Slider from '../common/Slider.jsx'

const ServicesSlider = (props) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(response => {
      setServices(response);
    })

  }, [])
  return (
    <Slider options={services} dataType='services' {...props} />
  )
}

export default ServicesSlider