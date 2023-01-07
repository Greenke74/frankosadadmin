import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

import AddButton from "./AddButton.jsx";
import OptionsPicker from "./OptionsPicker.jsx";
import {
  Box,
  Grow,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { getImageSrc } from "../../services/storage-service.js";

const Slider = (props) => {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const isMedium = useMediaQuery("(min-width:600px)");

  const { dataType, registerName, control, errors } = props;
  const options = props[dataType];

  const {
    fields: slidesFields,
    append: appendSlide,
    remove: removeSlide,
  } = useFieldArray({
    name: `${registerName}.${dataType}`,
    control: control,
    rules: {
      validate: {
        minLength: (value) => value.length > 0,
      },
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddSlide = (slide) => {
    if (slide.id) {
      if (slidesFields.length + 1 == options.length) {
        setAnchorEl(null);
      }
      appendSlide({ value: slide });
    }
  };

  const handleDeleteSlide = (idx) => {
    removeSlide(idx);
  };

  const availableOptions = options.filter(
    (o) => !slidesFields.find((slide) => slide.value.id == o.id)
  );
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "start",
          position: "relative",
          overflowX: "scroll",
        }}
      >
        {errors &&
        errors[dataType] &&
        errors[dataType].root?.type == "minLength" ? (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              width: "100%",
              minHeight: "215px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              color="#BABABA"
              textAlign="center"
              fontSize="22px"
              fontWeight={600}
            >
              Слайдів немає
            </Typography>
            <Typography
              sx={{
                color: "red",
                fontSize: "14px",
                fontWeight: 400,
                mt: 1,
                textAlign: "center",
              }}
            >
              Додайте щонайменше 1 слайд до блока
            </Typography>
          </Box>
        ) : (
          (slidesFields ?? []).map(({ value: s, id }, idx) => {
            return (
              <Grow in={idx !== undefined} key={s.id}>
                <Box
                  sx={{
                    bgcolor: "white",
                    flexBasis: isDesktop ? "30%" : isMedium ? "50%" : "100%",
                    maxWidth: isDesktop ? "17vw" : isMedium ? "30vw" : "60vw",
                    flexGrow: 1,
                    flexShrink: 0,
                    mx: 1,
                  }}
                >
                  <img
                    src={getImageSrc(s.image)}
                    alt={s.title}
                    style={{
                      borderRadius: 5,
                      width: "100%",
                      backgroundColor: "#BABABA",
                      minHeight: "103px",
                    }}
                  />
                  <Box
                    marginTop={1}
                    display="flex"
                    flexWrap="nowrap"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize="16px"
                      fontWeight={500}
                      color="var(--theme-color)"
                      textAlign="center"
                      lineHeight="30px"
                      marginLeft={1}
                      component={"h3"}
                      style={{
                        WebkitLineClamp: 1,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        cursor: "default",
                      }}
                    >
                      {s.title}
                    </Typography>
                    <Tooltip disableFocusListener title="Видалити слайд">
                      <IconButton
                        color="error"
                        id={`${id}-slide-delete-button`}
                        onClick={() => {
                          handleDeleteSlide(idx);
                        }}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grow>
            );
          })
        )}
      </Box>
      {(availableOptions ?? []).length > 0 && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop={3}
            alignItems="center"
            position="relative"
          >
            <AddButton label="Додати слайд" onClick={handleOpenModal} />
          </Box>
          <OptionsPicker
            anchorEl={anchorEl}
            options={availableOptions}
            onAdd={handleAddSlide}
            onClose={handleClose}
            dataType={dataType}
          />
        </>
      )}
    </Box>
  );
};

export default Slider;
