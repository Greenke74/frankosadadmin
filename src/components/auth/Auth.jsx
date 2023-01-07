import React, { useState, lazy, Suspense } from "react";

import { Box } from "@mui/material";
import SignInForm from "./SignInForm";

import { Spinner } from "../common/StyledComponents";
const RecoverPasswordForm = lazy(() => import("./RecoverPasswordForm"));

const Auth = () => {
  const [resetPassword, setResetPassword] = useState(false);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundColor="var(--theme-color)"
    >
      {resetPassword ? (
        <Suspense fallback={<Spinner />}>
          <RecoverPasswordForm />
        </Suspense>
      ) : (
        <SignInForm setResetPassword={setResetPassword} />
      )}
    </Box>
  );
};

export default Auth;
