import { lazy } from 'react';
import { getRoutes } from "./services/routes-service.jsx";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import AuthWrapper from "./supabase/AuthWrapper.jsx";

import Layout from "./components/layout/Layout.jsx";
import Auth from "./components/auth/Auth.jsx";

function App() {
  const auth = useSelector(state => state.auth);

  const routes = auth?.role
    ? (
      <Layout>
        <Routes>
          {getRoutes().map(({ path, element }) => {
            if (!element) {
              return null;
            }
            const Element = lazy(element);
            return (
              <Route
                path={path}
                element={<Element />}
                key={path} />
            )
          })}
        </Routes>
      </Layout>
    ) : (
      <Routes>
        <Route path={'*'} element={<Auth />} />
      </Routes>
    )

  return (
    <AuthWrapper>
      {routes}
    </AuthWrapper >
  );
}

export default App;