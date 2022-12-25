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
  onDeleteBlock,
  appendImageToDelete = () => {}
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

  const onMoveBlock = (from, to) => {
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
              <Grid item key={id ?? value.id} sx={{overflow: 'hidden !important', maxWidth: '100% !important'}}>
                <Grow in={true}>
                  <div style={{maxWidth: '100%'}}>
                    <Block
                      data={value}
                      idx={idx}
                      blocksLength={blocks.length}
                      onMoveBlock={onMoveBlock}
                      onDeleteBlock={(block) => {
                        if (block.id !== undefined) {
                          onDeleteBlock(block);
                        }
                        removeBlock(idx);
                      }}
                      appendImageToDelete={appendImageToDelete}
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