import React from 'react'
import { Box, Grid } from '@mui/material';
import BlockModal from './BlockModal';
import Block from './Block';
import { dataTypes } from '../../services/data-types-service';
import { submitBlock } from '../../helpers/api-helpers';

const BlocksComposition = ({
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

  const onBlockMove = async (from, to) => {
    if(from == blocks.length || to < 0){
      return;
    }

    // is
    console.log(blocks[from]);
    moveBlock(from, to);

    await submitBlock({...blocks[from].value, position: Number(to) }, isMainPage)
    await submitBlock({...blocks[to].value,  position: Number(from) }, isMainPage)

  }

  return (
    <Box p={1} pb={0} border='.13rem #c0c0c0 dashed' borderRadius='8px' overflow='hidden'>
      {/* <Box sx={{ mt: '2px' }}>
          {isLoading ? (<StyledLinearProgress />) : (<Box sx={{ height: '4px' }} />)}
        </Box> */}
      <Box px={2} py={3}>
        <Grid container spacing={3} direction='column'>
          {blocks.map(({ value }, idx) => {

            const initialBlockState = {
              ...value,
              position: idx
            }
            dataTypes.forEach(type => {
              if (value[type] && Array.isArray(value[type])) {
                initialBlockState[type] = value[type].map(i => ({ value: i }))
                initialBlockState[`${type}_ids`] = []
              }
            })

            return (
              <Grid item key={initialBlockState.id} >
                <Block
                  data={initialBlockState}
                  blocksLength={blocks.length}
                  allowedBlocks={allowedBlocks}
                  idx={idx}
                  isMainPage={isMainPage}
                  update={updateBlock}
                  move={moveBlock}
                  onMove={onBlockMove}
                  remove={removeBlock}
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
        isMainPage={isMainPage}
      />
    </Box>
  )
}

export default BlocksComposition;