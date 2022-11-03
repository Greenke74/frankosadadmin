import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import { getRoutes } from "./services/routes-service.jsx";
import { useSelector } from "react-redux";
import SignInForm from "./components/SignInForm.jsx";

function App() {
  const auth = useSelector(state => state.auth);

  return (
    auth?.role
      ? (
        < Router >
          <Layout>
            <Routes>
              {getRoutes().map(({ path, element }) => (
                <Route path={path} element={element} key={path} />
              ))}
            </Routes>
          </Layout>
        </ Router>
      ) : (<SignInForm />)
  );
}

export default App;