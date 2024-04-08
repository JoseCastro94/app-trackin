import { useState, useContext, useEffect, useCallback } from "react"
import { IconRefresh } from "@tabler/icons"
import { Button, IconButton, MenuItem, Typography } from "@mui/material"
import * as React from "react"
import MainModal from "../../../../ui-component/modals/MainModal"
import Select from "@mui/material/Select"
import { buscarEmpresaPorRuc } from "../../../../services/Empresa"

import { modeContext } from '../../../../context/modeContext'

import { useNavigate } from 'react-router-dom'

import { useTheme } from '@mui/material/styles';

const baseURL = process.env.PUBLIC_URL

const EmpresaSecion = () => {
    const theme = useTheme();
    const [value, setValue] = useState(' ');
    const [empresas, setEmpresas] = useState([]);
    const [openModalSeleccionaEmpresa, setOpenModalSeleccionaEmpresa] = useState(false)

    const { setCompany, company, token, setTokenCompany } = useContext(modeContext)
    const navigate = useNavigate()

    const loadEmpresas = useCallback(
        () => {
            if (token) {
                setOpenModalSeleccionaEmpresa(true)
                fetch(`${process.env.REACT_APP_API}business/api/usuario/empresas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                        cache: 'no-cache',
                        pragma: 'no-cache',
                        'cache-control': 'no-cache'
                    }
                })
                    .then(res => {
                        if (res.ok) {
                            res
                                .json()
                                .then(lista_empresa => {
                                    setEmpresas(lista_empresa)
                                })
                        } else {
                            navigate(`${baseURL}/security/logout`)
                        }
                    })
            }
        },
        [token, navigate],
    )

    useEffect(() => {
        if (!company) {
            loadEmpresas()
        }
    }, [company, loadEmpresas])

    return (
        <>
            <div style={{ marginLeft: 20 }}>
                <Typography id="modal-find-worker" variant="h2" component="span" sx={{
                    verticalAlign: "middle",
                    color: theme.palette.primary.main
                }}>{
                        company?.razon_social || ''
                    }</Typography>
                <IconButton aria-label="refresh"
                    size="small"
                    color="primary"
                    sx={{ ml: 2 }}
                    onClick={() => loadEmpresas()}>
                    <IconRefresh />
                </IconButton>
            </div>

            <MainModal
                open={openModalSeleccionaEmpresa}
                onClose={() => { return false }}
                aria_labelledby="modal-find-worker"
                aria_describedby="modal-find-pick-worker"
                styleBody={{
                    width: '20%',
                    textAlign: 'center'
                }}
            >
                <Typography id="modal-find-worker" variant="h3" component="h2">
                    Selecciona la empresa
                </Typography>
                <Select
                    sx={{ marginTop: "1rem" }}
                    value={value}
                    size={"small"}
                    fullWidth
                    onChange={(event) => {
                        setValue(event.target.value)
                    }}
                >
                    <MenuItem value=" ">-- Seleccione --</MenuItem>
                    {empresas.map((empresa, index) => (
                        <MenuItem key={index} value={empresa.ruc}>{empresa.razon_social}</MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    color={"primary"}
                    sx={{ marginRight: "1rem", marginTop: "1rem" }}
                    fullWidth
                    onClick={async () => {
                        if (!value.trim()) return
                        const empresa = empresas.find(empresa => empresa.ruc === value)
                        const tokenEmpresa = await buscarEmpresaPorRuc(empresa.ruc, token)
                        setOpenModalSeleccionaEmpresa(false)
                        setCompany(empresa)
                        setTokenCompany(tokenEmpresa)
                        localStorage.setItem('tokenCompany', tokenEmpresa)
                        localStorage.setItem('company', JSON.stringify(empresa))
                    }}
                >
                    Ingrese
                </Button>
            </MainModal>
        </>
    )
}

export default EmpresaSecion
