const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 14,
    // auth: {
    //     user: localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).data : undefined,
    //     empresa: localStorage.getItem('tokenCompany') ? JSON.parse(atob(localStorage.getItem('tokenCompany').split('.')[1])).data : undefined
    // }
};

export default config;
