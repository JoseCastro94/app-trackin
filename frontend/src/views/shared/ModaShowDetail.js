import * as React from 'react'
import PropTypes from 'prop-types'
import {
    Typography,
    Button,
    Box,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import MainModal from '../../ui-component/modals/MainModal.js'
import { modeContext } from '../../context/modeContext'
import {rechazarSolicitud , aprobarSolicitudPendienteAprobacion } from "../../services/SolicitudTransferencia";
import AlertApp from '../../ui-component/alerts/AlertApp.js'

const ModalShowDetail = ({
    open = false,
    handleClose = () => { },
    handleMetodo= () => { },
    title = 'Título',
    method = 'GET',
    url = '',
    columns = [],
    param = {},
    estado = ''
}) => {
    const [openModal, setOpenModal] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [titulo , setTitulo]= React.useState('')
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

    const { token, tokenCompany } = React.useContext(modeContext)
    const [list, setList] = React.useState([])
    React.useEffect(() => {
        if (open) {
            let config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            }
            if (method === 'POST') {
                config.body = JSON.stringify(param)
            }
            fetch(url, config)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    setList(response)
                })
        }
    }, [open, url, param, method, token, tokenCompany])

    const handleAprobar = React.useCallback(async () => {
        // Lógica para aprobar
        let data = {
            idSolicitud: param.idSolicitud
        };

        let result = await aprobarSolicitudPendienteAprobacion(token, tokenCompany, data);

        handleClose();
        setTitulo('Aprobación de Solicitud');
        setOpenAlert(true)
        if(result.data == true){
            setStateMessage(
                {
                    message:'Se aprobó correctamente la solicitud',
                    severity: 'success'
                }
            )
        }else{
            setStateMessage(
                {
                    message:'No se pudo aprobar la solicitud',
                    severity: 'error'
                }
            )
        }
        handleMetodo();
    })

    const handleRechazar = React.useCallback(async () => {
        // Lógica para rechazar
        let result = await rechazarSolicitud(token, tokenCompany, param.idSolicitud);
       
        handleClose();
        setTitulo('Rechazo de Solicitud');
        setOpenAlert(true)
        if(result.data == true){
            setStateMessage(
                {
                    message:'Se rechazó correctamente la solicitud',
                    severity: 'success'
                }
            )
        }else{
            setStateMessage(
                {
                    message:'No se pudo rechazar la solicitud',
                    severity: 'error'
                }
            )
        }
        handleMetodo();
    })

    return (
        <>
           <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-article"
            aria_describedby="modal-find-pick-article"
        >
            <Typography id="modal-find-article" variant="h3" component="h2">{title}</Typography>
            <br />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={list}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
            {estado === 'Pendiente Aprobacion' && (
                <Box mt={2}>
                    <Button variant="contained" color="error" onClick={handleRechazar}>Rechazar</Button>
                    <Button variant="contained" color="primary" onClick={handleAprobar} style={{ marginLeft: '42px' }}>Aprobar</Button>
                </Box>
            )}


        </MainModal>

        <AlertApp
            open={openAlert}
            title={titulo}
            body={stateMessage.message}
            handleClose={handleCloseAlert}
            severity={stateMessage.severity}
        />

        </>
    )
}

ModalShowDetail.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    estadoSolicitud: PropTypes.string,
}

export default ModalShowDetail
