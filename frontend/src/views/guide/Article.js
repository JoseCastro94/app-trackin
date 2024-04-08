import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Grid,
    FormControl,
    InputLabel,
    useMediaQuery,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TextField,
    Button,
    Select,
    MenuItem,
} from '@mui/material'

import DataGridApp from '../../ui-component/grid/DataGridApp'
import { GridActionsCellItem } from '@mui/x-data-grid'

import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'

import AlertApp from '../../ui-component/alerts/AlertApp'
import PickArticle from '../shared/article/PickArticle.js'

import { modeContext } from '../../context/modeContext'

import { v4 as uuidv4 } from 'uuid'

const Article = React.forwardRef(({
    IdGuia,
    info = {}
}, ref) => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const [articulo, setArticulo] = React.useState({
        IdArticulo: '',
        ItemCode: '',
        ItemName: ''
    })

    const [cantidad, setCantidad] = React.useState(1)
    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value))
    }

    const [comentario, setComentario] = React.useState('')
    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

    const [medida, setMedida] = React.useState('-')
    const handleChangeMedida = (event) => {
        setMedida(event.target.value)
    }
    const [listMedida, setListMedida] = React.useState([])

    const [rows, setRows] = React.useState([])

    const deleteDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id))
            })
        },
        [],
    )

    const columns = React.useMemo(
        () => [
            { field: 'codigo_medida', headerName: 'Cód. unid. medida', width: 150, headerAlign: 'center', },
            { field: 'unidad_medida', headerName: 'Unid. medida', width: 150, headerAlign: 'center', },
            {
                field: 'cantidad',
                headerName: 'Cantidad',
                type: 'number',
                width: 90,
                editable: true,
                headerAlign: 'center',
            },
            { field: 'articulo', headerName: 'Articulo', width: 350, headerAlign: 'center', },
            { field: 'codigo_articulo', headerName: 'Cód. articulo', width: 150, headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    if (!IdGuia) {
                        a.push(<GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={deleteDetail(params.id)}
                        />)
                    }
                    return a
                }
            },
            { field: 'id', hide: true },
        ],
        [deleteDetail, IdGuia]
    )

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/4f9d46a9-ae7f-4e8d-a9a6-e288ee881765`, {
            method: 'POST',
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
                setListMedida(response)
            })
    }, [token, tokenCompany])

    const [openFind, setOpenFind] = React.useState(false)
    const handleOpenFind = (action) => {
        setOpenFind(action)
    }

    const handleSelectedArticle = (article) => {
        setArticulo({
            IdArticulo: article.id,
            ItemCode: article.ItemCode,
            ItemName: article.ItemName,
        })
        setMedida(article.U_BPP_TIPUNMED)
    }

    const [openAlert, setOpenAlert] = React.useState(false)
    const [stateMessage, setStateMessage] = React.useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const clear_article = () => {
        setArticulo({
            IdArticulo: '',
            ItemCode: '',
            ItemName: ''
        })
        setCantidad(1)
    }

    const handleAddArticle = () => {
        let msg = []

        if (cantidad < 1) {
            msg.push('La cantidad ingresada no puede ser negativo o cero')
        }

        if (medida === '-') {
            msg.push('Debe de seleccionar una unidad de medida')
        }

        if (articulo.IdArticulo === '') {
            msg.push('Debe de seleccionar un articulo')
        }

        if (msg.length === 0) {
            const findMedida = listMedida.find(f => f.Nombre === medida)

            let newRow = {
                id: uuidv4(),
                codigo_medida: findMedida.Nombre,
                unidad_medida: findMedida.Descripcion,
                cantidad: cantidad,
                articulo: articulo.ItemName,
                codigo_articulo: articulo.ItemCode
            }
            setRows(list => [...list, newRow])
            clear_article()
        } else {
            setOpenAlert(true)
            setStateMessage(
                {
                    message: msg.join(', '),
                    severity: 'warning'
                }
            )
        }
    }

    const handleEditCantidad = (
        params,
    ) => {
        const id = params.id
        const key = params.field
        const value = params.value
        const number = parseInt(value)

        const back = () => {
            setRows(previews => {
                return previews.map(element => element)
            })
        }

        const row = rows.find(f => f.id === id)

        if (row) {
            let msg = []
            if (number < 1) {
                msg.push('La cantidad ingresada no puede ser negativo o cero')
            }

            if (msg.length > 0) {
                setStateMessage({
                    message: msg[0],
                    severity: 'error'
                })
                setOpenAlert(true)
                back()
            } else {
                setRows(previews => {
                    let preview = previews.find(f => f.id === id)
                    if (preview) {
                        preview[key] = number
                    }
                    return previews
                })
            }
        }
    }

    const getData = () => {
        const data = {
            rows: rows,
            comentario: comentario,
        }
        return data
    }

    const getValidate = () => {
        let msg = []
        if (rows.length === 0) {
            msg.push('Debe de seleccionar uno o más artículos')
        }
        return msg
    }

    React.useImperativeHandle(ref, () => ({
        getData,
        getValidate,
    }))

    React.useEffect(() => {
        if (IdGuia && info) {
            if (info.Observaciones) {
                setComentario(info.Observaciones)
            }
            if (info.DetalleGuiaRemisions) {
                let list = info.DetalleGuiaRemisions.filter(f => f.Items !== null).map(element => {
                    return {
                        id: uuidv4(),
                        codigo_medida: element.UnidadMedida,
                        unidad_medida: element.DesUnidadMedida,
                        cantidad: element.CantidadItems,
                        articulo: element.DetalleItems,
                        codigo_articulo: element.SKUProd,
                    }
                })
                setRows(list)
            }
        } else if (!IdGuia && info) {
            if (info.DetalleGuiaRemisions) {
                let list = info.DetalleGuiaRemisions.map(element => {
                    return {
                        id: uuidv4(),
                        codigo_medida: element.UnidadMedida,
                        unidad_medida: element.DesUnidadMedida,
                        cantidad: element.CantidadItems,
                        articulo: element.DetalleItems,
                        codigo_articulo: element.SKUProd,
                    }
                })
                setRows(list)
            }
        }
    }, [IdGuia, info])

    return (
        <Grid container spacing={matchDownSM ? 0 : 2}>
            {
                !IdGuia &&
                <>
                    <Grid item xs={2} sm={2}>
                        <FormControl variant="outlined" margin='normal' fullWidth>
                            <InputLabel htmlFor="txtCodArticulo" size='small'>Cod. artículo</InputLabel>
                            <OutlinedInput
                                id="txtCodArticulo"
                                type="text"
                                size='small'
                                value={articulo.ItemCode}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            size='small'
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={() => { handleOpenFind(true) }}
                                        >
                                            <SearchIcon></SearchIcon>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="# de Documento"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <TextField
                            fullWidth
                            label="Descripción:"
                            margin="normal"
                            name="descripcion_articulo"
                            type="text"
                            size='small'
                            value={articulo.ItemName}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <TextField
                            fullWidth
                            label="Cantidad"
                            margin="normal"
                            name="cantidad"
                            type="number"
                            value={cantidad}
                            size='small'
                            color="primary"
                            onChange={handleChangeCantidad}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <FormControl fullWidth size='small' margin='normal'>
                            <InputLabel id="lblMedida">Medida:</InputLabel>
                            <Select
                                labelId="lblMedida"
                                label="Medida"
                                size='small'
                                name='Medida'
                                onChange={handleChangeMedida}
                                value={medida}
                            >
                                <MenuItem value='-'>--Seleccionar--</MenuItem>
                                {
                                    listMedida.map((option) =>
                                        <MenuItem key={option.Nombre} value={option.Nombre}>{option.Descripcion}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={2} alignSelf="center">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAddArticle}
                        >
                            Añadir
                        </Button>
                    </Grid>
                </>
            }
            <Grid item xs={12}>
                <DataGridApp
                    rows={rows}
                    columns={columns}
                    onCellEditCommit={handleEditCantidad}
                ></DataGridApp>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Comentarios:"
                    margin="normal"
                    name="comentarios"
                    placeholder='Escribe aquí tus comentarios'
                    type="text"
                    size='small'
                    value={comentario}
                    onChange={handleChangeComentario}
                    multiline
                    maxRows={4}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <PickArticle
                open={openFind}
                handleClose={() => { handleOpenFind(false) }}
                handleSelectedArticle={handleSelectedArticle}
                url={process.env.REACT_APP_API + 'business/api/articulo/getGenericArticle'}
                columns={[
                    { field: 'ItemName', headerName: 'Artículo', width: 200 },
                    { field: 'ItemCode', headerName: 'Código', width: 400 },
                    { field: 'U_BPP_TIPUNMED', headerName: 'Medida', width: 200 },
                    { field: 'id', hide: true },
                ]}
            >
            </PickArticle>
            <AlertApp
                open={openAlert}
                title="Registro de solicitudes"
                body={stateMessage.message}
                handleClose={handleCloseAlert}
                severity={stateMessage.severity}
            >
            </AlertApp>
        </Grid>
    )
})

export default Article