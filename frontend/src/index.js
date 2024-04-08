import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import { store } from './store';

// style + assets
import './assets/scss/style.scss';

import config from './config.js';

import { ModeProvider } from './context/modeContext';

// const { fetch: originalFetch } = window;

// window.fetch = async (...args) => {
//     let [resource, config = {}] = args
//     //console.log('config-http-fetch', config)
//     const headers = config ? { ...config.headers } : {}
//     headers.token = localStorage.getItem('token')
//     headers.empresa = localStorage.getItem('tokenCompany')
//     config.headers = headers
//     return originalFetch(resource, config)
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<React.StrictMode>
        <Provider store={store}>
            <ModeProvider>
                <BrowserRouter basename={config.basename}>
                    <App />
                </BrowserRouter>
            </ModeProvider>
        </Provider>
    //</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
