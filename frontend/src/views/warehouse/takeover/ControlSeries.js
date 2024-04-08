import * as React from 'react'

import {
    Typography,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal'
import DataGridApp from '../../../ui-component/grid/DataGridApp'

import { modeContext } from '../../../context/modeContext'

const ControlSeries = ({
    open = false,
    handleClose = () => { },
    options = {
        url: '',
        method: '',
        param: {}
    },
    columns = [
        { field: 'Negocio', headerName: 'Negocio', width: 200 },
        { field: 'ItemCode', headerName: 'Código', width: 150 },
        { field: 'ItemName', headerName: 'Nombre', width: 150 },
        { field: 'SerialNumber', headerName: 'Serie', width: 150 },
        { field: 'id', hide: true },
    ],
}) => {
    const [rows, setRows] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)

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
                Lista de control de series
            </Typography>
            <DataGridApp
                rows={rows}
                columns={columns}
            ></DataGridApp>
        </MainModal>
    )
}

export default ControlSeries