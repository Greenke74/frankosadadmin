import React, { useState } from 'react'
import { Tabs as MuiTabs, Tab, styled } from '@mui/material'

const StyledTabs = styled(MuiTabs)({
  '& .MuiTab-root': {
    textTransform: 'none',
    color: 'var(--theme-color)'
  },
  '& .MuiTabs-indicator': {
    backgroundColor: 'var(--active-color)'
  }
})

const Tabs = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <StyledTabs value={currentTab} onChange={(event, value) => setCurrentTab(value)}>
        {tabs.map((tab, index) => (
          <Tab value={index} label={tab.label} />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <div
          role='tabpanel'
          hidden={currentTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </>
  )
}

export default Tabs