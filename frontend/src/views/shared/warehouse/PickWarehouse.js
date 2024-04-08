import * as React from 'react'

import PropTypes from 'prop-types'

import {
    Typography,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal.js'

import DataGridApp from '../../../ui-component/grid/DataGridApp.js'

import { modeContext } from '../../../context/modeContext'

const columns = [
    { field: 'Nombre', headerName: 'Almacen/Punto de venta', width: 200 },
    { field: 'Tipo', headerName: 'Tipo', width: 150 },
    { field: 'Direccion', headerName: 'Direccion', width: 200 },
    { field: 'ApellidoPaterno', headerName: 'Apellido Paterno', width: 200 },
    { field: 'ApellidoMaterno', headerName: 'Apellido Materno', width: 200 },
    { field: 'Nombres', headerName: 'Nombres', width: 200 },
    { field: 'NroDocumento', headerName: 'DNI', width: 200 },
    { field: 'id', hide: true },
]

const PickWarehouse = ({
    open = false,
    handleClose = () => { },
    handleSelectedWarehouse = () => { },
    url = '',
    param = {},
    tipo = ''
}) => {
    const { token, tokenCompany } = React.useContext(modeContext)
    const [list, setList] = React.useState([])
    React.useEffect(() => {
        if (open) {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(param),
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
                    setList(response)
                })
        }
    }, [open, url, param, token, tokenCompany])

    const handleSelected = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = list.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            handleClose()
            handleSelectedWarehouse(selectedRowData, tipo)
        }
    }

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-article"
            aria_describedby="modal-find-pick-warehouse"
        >
            <Typography id="modal-find-warehouse" variant="h3" component="h2">
                Almacen
            </Typography>
            <DataGridApp
                rows={list}
                columns={columns}
                onSelectionModelChange={handleSelected}
            />
        </MainModal>
    )
}

PickWarehouse.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSelectedWarehouse: PropTypes.func,
}

export default PickWarehouse