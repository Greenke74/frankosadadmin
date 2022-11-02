import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import { getRoutes } from "./services/routes-service.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/index.js";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            {getRoutes().map(({ path, element }) => (
              <Route path={path} element={element} key={path} />
            ))}
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;