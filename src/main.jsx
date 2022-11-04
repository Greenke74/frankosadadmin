import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux/es/exports';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import { store } from "./redux/index.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
