import React, { useState, useEffect, forwardRef } from 'react'
import { getServices } from '../../services/services-api-service.js'
import Slider from '../common/Slider.jsx'

const ServicesSlider = ({ form }, ref) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(response => {
    })

  }, [])
  return (
    <Slider options={services} dataType='services' form={form} />
  )
}

export default forwardRef(ServicesSlider)