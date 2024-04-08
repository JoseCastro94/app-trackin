import MainModal from "../../ui-component/modals/MainModal";
import * as React from "react";
import {Autocomplete, Button, Divider, Grid, TextField, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const FormRegistroIngresoMercaderia = (props) => {
    const theme = useTheme()
    const { openFind, handleCloseFind } = props
    const tipoIngreso = [
        {
            id: '123456',
            nombre: 'Compra'
        },
        {
            id: '1234567',
            nombre: 'Venta'
        }
    ]

    const tipoDocumento = [
        {
            id: '123456',
            nombre: 'SOLMED'
        },
        {
            id: '1234567',
            nombre: 'SOLMED2'
        }
    ]

    const almacenes = [
        {
            id: '123456',
            nombre: 'Almacen 1'
        },
        {
            id: '1234567',
            nombre: 'Almacen 2'
        }
    ]
    const cuentas = [
        {
            id: '123456',
            nombre: 'Sony'
        },
        {
            id: '1234567',
            nombre: 'Samsung'
        }
    ]
    const [producto, setProducto] = React.useState({
        codigo: '',
        descripcion: '',
        cuenta: cuentas[0],
        cantidad: 0,
        comentario: ''
    })
    const [ingreso, setIngreso] = React.useState({
        tipo: tipoIngreso[0],
        documento: tipoDocumento[0],
        num_doc: '',
        almacen: almacenes[0],
        email: '',
    })

    const handleChangeTipoIngreso = (value) => {
        const data = {...ingreso}
        data.tipo = value
        setIngreso(data)
    }

    const handleChangeTipoDocumento = (value) => {
        const data = {...ingreso}
        data.documento = value
        setIngreso(data)
    }

    const handleChangeAlmacen = (value) => {
        const data = {...ingreso}
        data.almacen = value
        setIngreso(data)
    }

    const handleChangeNumeroDocumento = (value) => {
        const data = {...ingreso}
        data.num_doc = value
        setIngreso(data)
    }

    const handleChangeEmail = (value) => {
        const data = {...ingreso}
        data.email = value
        setIngreso(data)
    }

    const handleChangeCodigoProducto = (value) => {
        const data = {...producto}
        data.codigo = value
        setProducto(data)
    }

    const handleChangeDescripcion = (value) => {
        const data = {...producto}
        data.descripcion = value
        setProducto(data)
    }

    const handleChangeCuenta = (value) => {
        const data = {...producto}
        data.cuenta = value
        setProducto(data)
    }

    const handleChangeCantidad = (value) => {
        const data = {...producto}
        data.cantidad = value
        setProducto(data)
    }

    const handleChangeComentario = (value) => {
        const data = {...producto}
        data.comentario = value
        setProducto(data)
    }

    return <MainModal
        open={openFind}
        onClose={handleCloseFind}
        aria_labelledby="modal-find-worker"
        aria_describedby="modal-find-pick-worker"
        style={{width: 1000, margin: "0px auto"}}>

        <Typography id="modal-find-worker" sx={{ color: theme.palette.primary.main }} variant="h3" component="h2">
            Nuevo Ingreso
        </Typography>

        <Grid container>
            <Grid item xs={2} sm={2}>
                <p>Tipo Ingreso</p>
                <Autocomplete
                    options={tipoIngreso}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={ingreso.tipo}
                    openText=""
                    size="small"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeTipoIngreso(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Documento</p>
                <Autocomplete
                    options={tipoDocumento}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={ingreso.documento}
                    openText=""
                    size="small"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeTipoDocumento(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>#Documento</p>
                <TextField
                    type={"text"}
                    size={"small"}
                    onChange={(event) => {
                        return handleChangeNumeroDocumento(event.target.value)
                    }}
                    value={ingreso.num_doc}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Almacén</p>
                <Autocomplete
                    options={almacenes}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={ingreso.almacen}
                    openText=""
                    size="small"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeAlmacen(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Correo</p>
                <TextField
                    type={"email"}
                    placeholder="correo@email.com"
                    size={"small"}
                    onChange={(event) => {
                        return handleChangeEmail(event.target.value)
                    }}
                    value={ingreso.email}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Documento</p>
                <Button variant="contained"
                        size={"small"}
                        color={"secondary"}
                        onClick={() => handleCloseFind()}>
                    Subir
                </Button>
            </Grid>
        </Grid>

        <Divider sx={{mt: 2}}></Divider>

        <Grid container>
            <Grid item xs={2} sm={2}>
                <p>Cod. Producto</p>
                <TextField
                    type={"text"}
                    size={"small"}
                    onChange={(event) => {
                        return handleChangeCodigoProducto(event.target.value)
                    }}
                    value={producto.codigo}/>
            </Grid>
            <Grid item xs={4} sm={4}>
                <p>Descripción</p>
                <TextField
                    type={"text"}
                    size={"small"}
                    sx={{width: '100%'}}
                    onChange={(event) => {
                        return handleChangeDescripcion(event.target.value)
                    }}
                    value={producto.descripcion}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Cuenta</p>
                <Autocomplete
                    options={cuentas}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={producto.cuenta}
                    openText=""
                    size="small"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeCuenta(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Cantidad</p>
                <TextField
                    type={"number"}
                    size={"small"}
                    onChange={(event) => {
                        return handleChangeCantidad(event.target.value)
                    }}
                    value={producto.cantidad}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Stock</p>
                <p>40</p>
            </Grid>
        </Grid>
        <br/>
        <Grid container>
            <Grid item xs={10} sm={10}>
                <TextField
                    type={"text"}
                    placeholder={"Escribe aquí tus comentarios"}
                    size={"small"}
                    sx={{width: '100%'}}
                    onChange={(event) => {
                        return handleChangeComentario(event.target.value)
                    }}
                    value={producto.comentario}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <Button variant="contained"
                        size={"small"}
                        color={"secondary"}
                        onClick={() => handleCloseFind()}>
                    Añadir
                </Button>
            </Grid>
        </Grid>

        <Divider sx={{mt: 2}}></Divider>
    </MainModal>
}

export default FormRegistroIngresoMercaderia