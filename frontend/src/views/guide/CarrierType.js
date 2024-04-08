import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    useMediaQuery,
    TextField,
} from '@mui/material'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Stack from '@mui/material/Stack'
import esLocale from 'date-fns/locale/es'

import { modeContext } from '../../context/modeContext'

const localeMap = {
    es: esLocale
}

const CarrierType = React.forwardRef(({
    onChangeTipo = () => { },
    IdGuia,
    info = {}
}, ref) => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const [inicioTranslado, setInicioTranslado] = React.useState(new Date())

    const [tipo, setTipo] = React.useState('-')
    const handleChangeTipo = (event) => {
        let selectValue = event.target.value
        setTipo(selectValue)
        onChangeTipo(selectValue)
    }
    const [listTipo, setListTipo] = React.useState([])

    const [motivo, setMotivo] = React.useState('-')
    const handleChangeMotivo = (event) => {
        let selectValue = event.target.value
        setMotivo(selectValue)
    }
    const [listMotivo, setListMotivo] = React.useState([])

    const [descripcion, setDescripcion] = React.useState('')
    const handleDescripcion = (event) => {
        let selectValue = event.target.value
        setDescripcion(selectValue)
    }

    const [pesoBruto, setPesoBruto] = React.useState(1)
    const handlePesoBruto = (event) => {
        let selectValue = event.target.value
        setPesoBruto(selectValue)
    }

    const [unidadMedicion, setUnidadMedicion] = React.useState('-')
    const handleUnidadMedicion = (event) => {
        let selectValue = event.target.value
        setUnidadMedicion(selectValue)
    }
    const [listUnidadMedicion, setListUnidadMedicion] = React.useState([])

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/fa7dc607-8e72-4644-ba01-962e2df277d4`, {
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
                setListTipo(response)
            })

        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/fa7dc607-8e72-4644-ba01-962e2df277d3`, {
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
                setListMotivo(response)
            })

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
                setListUnidadMedicion(response)
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        if (listMotivo.length > 0) {
            if (!IdGuia) {
                setMotivo('13')
            }
        }
    }, [listMotivo, IdGuia])

    React.useEffect(() => {
        if (listTipo.length > 0) {
            if (!IdGuia) {
                setTipo('01')
            }
        }
    }, [listTipo, IdGuia])

    React.useEffect(() => {
        if (
            listUnidadMedicion.length > 0 &&
            listMotivo.length > 0 &&
            listTipo.length > 0 &&
            IdGuia
        ) {
            if (info.CodModaTranslado) {
                setTipo(info.CodModaTranslado)
            }
            if (info.FechaTransporte) {
                setInicioTranslado(new Date(info.FechaTransporte))
            }
            if (info.CodMotivoTrans) {
                setMotivo(info.CodMotivoTrans)
            }
            if (info.PesoTotal) {
                setPesoBruto(info.PesoTotal)
            }
            if (info.UnidadMedida) {
                setUnidadMedicion(info.UnidadMedida)
            }
        }
    }, [listUnidadMedicion, listMotivo, listTipo, info, IdGuia])

    const getData = () => {
        const find_motivo = listMotivo.find(f => f.Nombre === motivo)
        const data = {
            tipo: tipo,
            inicioTranslado: inicioTranslado,
            codigo_motivo: find_motivo.Nombre,
            motivo: find_motivo.Descripcion,
            descripcion: descripcion,
            pesoBruto: pesoBruto,
            unidadMedicion: unidadMedicion
        }
        return data
    }

    const getValidate = () => {
        let msg = []
        if (tipo === '-') {
            msg.push('Debe de seleccionar un tipo')
        }
        if (inicioTranslado === '') {
            msg.push('Debe de ingresar una fecha de translado')
        }
        if (motivo === '-') {
            msg.push('Debe de seleccionar un motivo')
        }
        if (descripcion === '') {
            msg.push('Debe de ingresar una descripción')
        }
        if (pesoBruto === '') {
            msg.push('Debe de ingresar un peso bruto')
        }
        if (unidadMedicion === '-') {
            msg.push('Debe de seleccionar un unidad de medida')
        }
        return msg
    }

    React.useImperativeHandle(ref, () => ({
        getData,
        getValidate,
    }))

    return (
        <Grid container spacing={matchDownSM ? 0 : 2}>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblTipo" disabled={IdGuia ? true : false}>Tipo:</InputLabel>
                    <Select
                        labelId="lblTipo"
                        label="Tipo"
                        size='small'
                        name='Tipo'
                        onChange={handleChangeTipo}
                        value={tipo}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listTipo.map((option) =>
                                <MenuItem key={option.Nombre} value={option.Nombre}>{option.Descripcion}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={localeMap["es"]}
                >
                    <Stack spacing={0}>
                        <DesktopDatePicker
                            size='small'
                            label="Inicio de Translado"
                            value={inicioTranslado}
                            minDate={new Date('2017-01-01')}
                            disabled={IdGuia ? true : false}
                            onChange={(newValue) => {
                                setInicioTranslado(newValue)
                            }}
                            renderInput={
                                (params) => {
                                    params.fullWidth = true
                                    params.margin = "normal"
                                    params.size = 'small'
                                    return (
                                        <TextField {...params} />
                                    )
                                }
                            }
                        />
                    </Stack>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblMotivo" disabled={IdGuia ? true : false}>Motivo:</InputLabel>
                    <Select
                        labelId="lblMotivo"
                        label="Motivo"
                        size='small'
                        name='Motivo'
                        onChange={handleChangeMotivo}
                        value={motivo}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listMotivo.map((option) =>
                                <MenuItem key={option.Nombre} value={option.Nombre}>{option.Descripcion}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
                <TextField
                    fullWidth
                    label="Descripción:"
                    margin="normal"
                    name="descripcion"
                    type="text"
                    size='small'
                    value={descripcion}
                    onChange={handleDescripcion}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <TextField
                    fullWidth
                    label="Peso bruto:"
                    margin="normal"
                    name="peso_bruto"
                    type="number"
                    size='small'
                    color="primary"
                    value={pesoBruto}
                    onChange={handlePesoBruto}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblMedida" disabled={IdGuia ? true : false}>Medida:</InputLabel>
                    <Select
                        labelId="lblMedida"
                        label="Medida"
                        size='small'
                        name='Medida'
                        onChange={handleUnidadMedicion}
                        value={unidadMedicion}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listUnidadMedicion.map((option) =>
                                <MenuItem key={option.Nombre} value={option.Nombre}>{option.Descripcion}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    )
})

export default CarrierType