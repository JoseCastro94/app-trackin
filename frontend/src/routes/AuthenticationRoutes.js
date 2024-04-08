import { lazy } from 'react';

// project imports
import Loadable from '../ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Register3')));
const AuthToken = Loadable(lazy(() => import('../views/pages/authentication/authentication3/AuthToken')));
const Logout = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Logout')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const baseURL = process.env.PUBLIC_URL

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: `${baseURL}/pages/login/login3`,
            element: <AuthLogin3 />
        },
        {
            path: `${baseURL}/pages/register/register3`,
            element: <AuthRegister3 />
        },
        {
            path: `${baseURL}/auth/:token`,
            element: <AuthToken />
        },
        {
            path: `${baseURL}/security/logout`,
            element: <Logout />
        }
    ]
};

export default AuthenticationRoutes;
