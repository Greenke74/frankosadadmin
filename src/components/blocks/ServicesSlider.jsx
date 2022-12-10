import React, { useState, useEffect } from 'react'
import { getServices } from '../../services/services-api-service.js'
import Slider from '../common/Slider.jsx'

const ServicesSlider = ({ form }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(response => {
    })

  }, [])
  return (
    <Slider options={services} dataType='services' form={form} />
  )
}

export default ServicesSlider