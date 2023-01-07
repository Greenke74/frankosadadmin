import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { Box, Button, FormControl, Typography } from "@mui/material";
import {
  StyledInputBase,
  StyledInputLabel,
  StyledLinearProgress,
  SuccessButton,
} from "../common/StyledComponents";
import { REGULAR_EXPRESSIONS } from "../../services/regex-service";
import { login } from "../../services/auth-api-service";
import ErrorMessage from "../common/ErrorMessage";
import { setAuthLoading } from "../../redux/slices/authLoading";

const SignInForm = ({ setResetPassword }) => {
  const [loginError, setLoginError] = useState(null);

  const authLoading = useSelector((state) => state.authLoading.loading);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = (credentails) => {
    dispatch(setAuthLoading(true));
    login(credentails)
      .then((user) => {
        dispatch(setAuthLoading(false));
        setLoginError(null);
      })
      .catch((e) => {
        dispatch(setAuthLoading(false));
        setLoginError(e);
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
      width="350px"
      maxWidth="95vw"
      padding={4}
      borderRadius={"8px"}
      backgroundColor="var(--background-color)"
    >
      {authLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "#ffffff70",
            zIndex: 1,
          }}
        >
          <StyledLinearProgress />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            fontSize="20px"
            fontWeight={500}
            color="var(--theme-color)"
            textAlign="center"
          >
            Увійдіть для доступу
          </Typography>
          <FormControl variant="standard" fullWidth>
            <StyledInputLabel shrink htmlFor="emailInput">
              E-mail
            </StyledInputLabel>
            <StyledInputBase
              id="emailInput"
              placeholder="E-mail"
              {...register("email", {
                required: true,
                pattern: REGULAR_EXPRESSIONS.EMAIL,
              })}
            />
            {errors.email && (
              <ErrorMessage
                type={
                  errors?.email.type == "pattern"
                    ? "emailPattern"
                    : errors?.email.type
                }
              />
            )}
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <StyledInputLabel shrink htmlFor="passwordInput">
              Пароль
            </StyledInputLabel>
            <StyledInputBase
              id="passwordInput"
              type="password"
              placeholder="Пароль"
              {...register("password", { required: true })}
            />
            {errors.password && <ErrorMessage type={errors?.password?.type} />}
          </FormControl>
          {loginError && <ErrorMessage type={loginError} />}
          <Box justifyContent="space-between" display="flex">
            <Button
              onClick={() => setResetPassword(true)}
              variant="text"
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--theme-color)",
                textTransform: "none",
              }}
            >
              Забули пароль?
            </Button>
            <SuccessButton type="submit">Увійти</SuccessButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default SignInForm;
