import React, { useState } from 'react'
import { Tabs as MuiTabs, Tab, styled, Box } from '@mui/material'

const StyledTabs = styled(MuiTabs)({
  '& .MuiTab-root': {
    textTransform: 'none !important',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: 'var(--active-color)'
  },
  '& .Mui-selected': {
    color: 'var(--active-color)'
  }
})

const Tabs = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <StyledTabs value={currentTab} onChange={(event, value) => setCurrentTab(value)}>
        {tabs.map((tab, index) => (
          <Tab value={index} label={tab.label} sx={{
            color: Object.keys(tab.errors ?? {}).length > 0 ? 'red !important' : index == currentTab ? 'var(--active-color) !important' : undefined
          }} />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <Box
          role='tabpanel'
          paddingTop={1}
          hidden={currentTab !== index}
        >
          {tab.content}
        </Box>
      ))}
    </>
  )
}

export default Tabs