import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../../store/constant'

import {
    Grid,
    Typography,
    Container,
    Button,
} from '@mui/material'

import DataGridApp from '../../../ui-component/grid/DataGridApp'
import { GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'

import Edit from './Edit'

import { modeContext } from '../../../context/modeContext'
import { useState } from 'react'

const SecurityCompanyHome = () => {
    const theme = useTheme()
    const { token, tokenCompany } = React.useContext(modeContext)
    const [rows, setRows] = React.useState([])

    const [idUsuario, setIdUsuario] = useState(null)

    const columns = React.useMemo(
        () => [
            { field: 'NroDocumento', headerName: 'Documento', width: 120, headerAlign: 'center', },
            { field: 'ApellidoPaterno', headerName: 'Apellido Paterno', width: 150, headerAlign: 'center', },
            { field: 'ApellidoMaterno', headerName: 'Apellido Materno', width: 150, headerAlign: 'center', },
            { field: 'Nombres', headerName: 'Nombres', width: 150, headerAlign: 'center', },
            { field: 'Correo', headerName: 'Correo', width: 200, headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Editar"
                            onClick={() => {
                                handleOpenUser(true)
                                setIdUsuario(params.row.id)
                            }}
                        />
                    )
                    return a
                },
            },
            { field: 'id', hide: true },
        ],
        [],
    )

    const load = React.useCallback(() => {
        fetch(process.env.REACT_APP_API + 'business/api/usuario/UsuariosEmpresa', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'empresa': tokenCompany,
                cache: 'no-cache',
                pragma: 'no-cache',
                'cache-control': 'no-cache'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                setRows(response)
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        load()
    }, [load])

    const [openUser, setOpenUser] = React.useState(false)

    const handleOpenUser = (action) => {
        setOpenUser(action)
    }

    const handleNewUser = () => {
        handleOpenUser(true)
        setIdUsuario(null)
    }

    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={8} md={10}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Mantenimiento de Usuario</Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size='small'
                        fullWidth
                        onClick={handleNewUser}
                    >
                        Nuevo
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <DataGridApp
                        rows={rows}
                        columns={columns}
                        height={420}
                    ></DataGridApp>
                </Grid>
            </Grid>
            <Edit
                open={openUser}
                handleClose={() => { handleOpenUser(false) }}
                handleFetch={() => { load() }}
                IdUsuario={idUsuario}
            >
            </Edit>
        </Container>
    )
}

export default SecurityCompanyHome