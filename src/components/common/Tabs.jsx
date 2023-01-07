import React from 'react'
import { Tabs as MuiTabs, Tab, styled, Box } from '@mui/material'
import { v1 as uuid } from 'uuid'

const StyledTabs = styled(MuiTabs)({
  '& .MuiTab-root': {
    textTransform: 'none !important',
  },
  '& .Mui-selected': {
    color: 'var(--active-color)'
  }
})

const Tabs = ({ tabs = [], children, currentTab, setCurrentTab }) => {

  const tabsWithErrors = tabs.map(t => ({ ...t, hasError: t.errors == true || Object.keys(t.errors ?? {}).length > 0 }))

  return (
    <>
      <StyledTabs
        value={currentTab}
        onChange={(event, value) => setCurrentTab(value)}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: tabsWithErrors[currentTab]?.hasError ? 'red !important' : 'var(--active-color) !important'
          }
        }}
      >
        {tabsWithErrors.map((tab, index) => {
          return (
            <Tab
              key={uuid()}
              value={index}
              label={tab.label}
              sx={{
                color: tab.hasError ? 'red !important' : index == currentTab ? 'var(--active-color) !important' : undefined,

              }} />
          )
        }
        )}
      </StyledTabs>
      <Box sx={{ overflow: 'hidden' }}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          transform: `translate(calc(-100% * ${currentTab}), 0px)`,
          width: '100%'
        }}>
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Tabs;