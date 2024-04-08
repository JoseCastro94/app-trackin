import * as React from 'react'

import {
    Typography,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal'
import DataGridApp from '../../../ui-component/grid/DataGridApp'
import { modeContext } from '../../../context/modeContext'


const PickUser = ({
    open = false,
    handleClose = () => { },
    options = {
        url: '',
        method: '',
        param: {}
    },
    columns = [
        { field: 'NroDocumento', headerName: 'NroDocumento', width: 200 },
        { field: 'Correo', headerName: 'Correo', width: 200 },
        { field: 'ApellidoPaterno', headerName: 'ApellidoPaterno', width: 200 },
        { field: 'ApellidoMaterno', headerName: 'ApellidoMaterno', width: 200 },
        { field: 'Nombres', headerName: 'Nombres', width: 200 },
        { field: 'id', hide: true },
    ],
    handleSelectedUser = () => { },
}) => {
    const { token, tokenCompany } = React.useContext(modeContext)
    const [rows, setRows] = React.useState([])

    const handleSelected = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = rows.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            handleClose()
            handleSelectedUser(selectedRowData)
        }
    }

    React.useEffect(() => {
        if (open) {
            if (options.url !== '') {
                fetch(options.url, {
                    method: options.method,
                    body: JSON.stringify(options.param),
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
            }
        }
    }, [open, options, token, tokenCompany])

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-user"
            aria_describedby="modal-find-pick-user"
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Seleccionar un usuario
            </Typography>
            <DataGridApp
                rows={rows}
                columns={columns}
                onSelectionModelChange={handleSelected}
            ></DataGridApp>
        </MainModal>
    )
}

export default PickUser