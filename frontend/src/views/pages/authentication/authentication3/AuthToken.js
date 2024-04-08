import { useEffect, useContext } from 'react'
import {
    useParams,
    useNavigate
} from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material'

// project imports
import AuthWrapper1 from '../AuthWrapper1'
import AuthCardWrapper from '../AuthCardWrapper'
import Logo from '../../../../ui-component/Logo'

// assets

import { modeContext } from '../../../../context/modeContext'

import generate from '../../../../menu-items/generate'

const baseURL = process.env.PUBLIC_URL

const Auth = () => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { setToken, setNavigation, setUser, setCompany } = useContext(modeContext)
    const { token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        //localStorage.clear()
        if (token) {
            localStorage.setItem("token", token)
            const exec = async () => {
                setToken(token)
                setCompany(null)

                const res_options = await fetch(`${process.env.REACT_APP_SECURITY_API}/api/external/options/${process.env.REACT_APP_ID_APP}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token
                    }
                })
                const options = await res_options.json()
                localStorage.setItem("navigate", JSON.stringify(options.data))
                setNavigation(generate(options.data))

                const res_user = await fetch(`${process.env.REACT_APP_SECURITY_API}/api/external/info/${process.env.REACT_APP_ID_APP}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token
                    }
                })
                const user = await res_user.json()
                localStorage.setItem("user", JSON.stringify(user.data))
                setUser(user.data)

                navigate(`${baseURL}/`)
            }
            exec()
        }
    }, [setToken, setNavigation, setUser, setCompany, token, navigate])

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '50vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Logo />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Bienvenido
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Registrando datos de acceso
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Auth