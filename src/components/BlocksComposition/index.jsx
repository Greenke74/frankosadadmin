import React, { useState, useEffect } from 'react'
import { Box, Grid, Grow } from '@mui/material';
import BlockModal from './BlockModal';
import Block from './Block';
import { getProjects } from '../../services/portfolio-api-service';
import { getServices } from '../../services/services-api-service';

const BlocksComposition = ({
  fieldArray,
  form,
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

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    getProjects().then(data => setProjects(data))
    getServices().then(data => setServices(data))
    // getOffers().then(data => setOffers(data))

  }, [])

  const onBlockMove = (from, to) => {
    if (from == blocks.length || to < 0) {
      return;
    }

    form.setValue(`blocks.${to}.value.position`, from);
    form.setValue(`blocks.${from}.value.position`, to);
    moveBlock(from, to);
  }

  return (
    <Box p={1} pb={0} border='.13rem #c0c0c0 dashed' borderRadius='8px' overflow='hidden'>
      {/* <Box sx={{ mt: '2px' }}>
          {isLoading ? (<StyledLinearProgress />) : (<Box sx={{ height: '4px' }} />)}
        </Box> */}
      <Box px={2} py={3}>
        <Grid container spacing={3} direction='column'>
          {blocks.map(({ value, id }, idx) => {
            return (
              <Grid item key={id ?? value.id} >
                <Grow in={true}>
                  <div>
                    <Block
                      data={value}
                      blocksLength={blocks.length}
                      idx={idx}
                      isMainPage={isMainPage}
                      update={updateBlock}
                      move={moveBlock}
                      onMove={onBlockMove}
                      remove={removeBlock}
                      onInsertBlock={onInsertBlock}
                      onDeleteBlock={(block) => {
                        if (block.id !== undefined) {
                          onDeleteBlock(block);
                        }
                        removeBlock(idx);
                      }}
                      registerName={`blocks.${idx}.value`}
                      register={form.register}
                      control={form.control}
                      formState={form.formState}
                      projects={projects}
                      services={services}
                    />
                  </div>
                </Grow>
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