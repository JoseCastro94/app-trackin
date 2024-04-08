import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../../store/constant'

import {
    Grid,
    Typography,
    Container,
} from '@mui/material'

import DataGridApp from '../../../ui-component/grid/DataGridApp'
import { GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'

import MainModal from '../../../ui-component/modals/MainModal'

import { modeContext } from '../../../context/modeContext'

const UserBusinessHome = () => {
    const theme = useTheme()
    const { token, tokenCompany } = React.useContext(modeContext)
    const [rows, setRows] = React.useState([])

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

    const procesar = (ids, id) => {
        fetch(process.env.REACT_APP_API + 'business/api/usuario_negocio/updUsuarioNegocio', {
            method: 'POST',
            body: JSON.stringify({
                IdUsuario: id,
                listNegocio: ids
            }),
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
                console.log(response)
            })
    }

    React.useEffect(() => {
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

    const [openUser, setOpenUser] = React.useState(false)

    const handleOpenUser = (action) => {
        setOpenUser(action)
    }

    const [idUsuario, setIdUsuario] = React.useState(null)

    const [rowsNegocio, setRowsNegocio] = React.useState([])

    const columnsNegocio = [
        { field: 'Nombre', headerName: 'Nombre', width: 300 },
        { field: 'id', hide: true },
    ]

    React.useEffect(() => {
        if (idUsuario) {
            fetch(process.env.REACT_APP_API + 'business/api/tipo_negocio/UsuarioTipoNegocio', {
                method: 'POST',
                body: JSON.stringify({
                    IdUsuario: idUsuario
                }),
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
                    setRowsNegocio(response.negocios)
                    setSelectionModel(response.select)
                })
        }
    }, [idUsuario, token, tokenCompany])

    const [selectionModel, setSelectionModel] = React.useState([])

    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Usuario - Negocio</Typography>
                </Grid>
                <Grid item xs={12}>
                    <DataGridApp
                        rows={rows}
                        columns={columns}
                        height={420}
                    ></DataGridApp>
                </Grid>
            </Grid>
            <MainModal
                open={openUser}
                onClose={() => { handleOpenUser(false) }}
                aria_labelledby="modal-find-user"
                aria_describedby="modal-find-pick-user"
            >
                <Typography id="modal-find-worker" variant="h3" component="h2">
                    Lista de tipo de negocio
                </Typography>
                <DataGridApp
                    rows={rowsNegocio}
                    columns={columnsNegocio}
                    checkboxSelection
                    disableSelectionOnClick
                    selectionModel={selectionModel}
                    onSelectionModelChange={(ids) => {
                        setSelectionModel(ids)
                        procesar(ids, idUsuario)
                    }}
                ></DataGridApp>
            </MainModal>
        </Container>
    )
}

export default UserBusinessHome