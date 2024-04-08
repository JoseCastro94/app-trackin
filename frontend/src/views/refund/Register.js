import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../store/constant'

import {
    Grid,
    Typography,
    Container,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'

import Member from './Member.js'

import { modeContext } from '../../context/modeContext'

const RefundRegister = () => {
    const theme = useTheme()
    const { token, tokenCompany } = React.useContext(modeContext)
    const [members, setMembers] = React.useState([])

    const find = React.useCallback((filter) => {
        fetch(process.env.REACT_APP_API + 'business/api/grupo_trabajador/GrupoTrabajadorFull', {
            method: 'POST',
            body: JSON.stringify({
                filter: filter
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
                setMembers(response)
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        find()
    }, [find])

    const [filter, setFilter] = React.useState('')
    const handleChangeFilter = (event) => {
        setFilter(event.target.value)
    }

    const handleFilter = () => {
        find(filter)
    }

    return (
        <Container>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Devolución de artículo</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Grupo</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" margin='normal' fullWidth hiddenLabel sx={{
                        marginTop: 0,
                        marginBottom: 0
                    }}>
                        <InputLabel htmlFor="txtFind" size='small'>Buscar por Nombre o Código</InputLabel>
                        <OutlinedInput
                            id="txtFind"
                            type="text"
                            size='small'
                            margin='none'
                            fullWidth
                            value={filter}
                            onChange={handleChangeFilter}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        size='small'
                                        aria-label="find to refound"
                                        edge="end"
                                        onClick={handleFilter}
                                    >
                                        <SearchIcon></SearchIcon>
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Cod. de producto:"
                        />
                    </FormControl>
                </Grid>
                {
                    members.map(member => {
                        return (
                            <Member
                                key={member.id}
                                nombre={`${member.ApellidoPaterno} ${member.ApellidoMaterno} ${member.Nombres}`}
                                dni={member.NroDocumento}
                                razon_social={member.RazonSocial}
                                estado={member.Activo}
                                id={member.id}
                            >
                            </Member>
                        )
                    })
                }
            </Grid>
        </Container >
    )
}

export default RefundRegister