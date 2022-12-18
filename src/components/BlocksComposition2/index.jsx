import React from 'react'
import { Box, Grid } from '@mui/material';
import Block from './Block'
import { StyledLinearProgress } from '../common/StyledComponents';
import BlockModal from './BlockModal';

const BlocksComposition2 = ({
  fieldArray,
  allowedBlocks,
  isMainPage = false,
  onInsertBlock,
  onDeleteBlock
}) => {
  const {
    fields: blocks,
    append: appendBlock,
    remove: removeBlock,
    move: moveBlock,
    update: updateBlock
  } = fieldArray;


  return (
    <Box p={1} pb={0} border='.13rem #c0c0c0 dashed' borderRadius='8px' overflow='hidden'>
      {/* <Box sx={{ mt: '2px' }}>
          {isLoading ? (<StyledLinearProgress />) : (<Box sx={{ height: '4px' }} />)}
        </Box> */}
      <Box px={2} py={3}>
        <Grid container spacing={3} direction='column'>
          {blocks.map((b, idx) => {
            return (
              <Grid item key={b.id} >
                <Block
                  block={b.value.block}
                  blocksLength={blocks.length}
                  allowedBlocks={allowedBlocks}
                  idx={idx}
                  isMainPage={isMainPage}
                  update={updateBlock}
                  onInsertBlock={onInsertBlock}
                  onDeleteBlock={onDeleteBlock}
                />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <BlockModal
        allowedBlocks={allowedBlocks}
        appendBlock={(block) => {
          appendBlock({ value: block })
        }}
        blocksLength={blocks.length}
      />
    </Box>
  )
}

export default BlocksComposition2