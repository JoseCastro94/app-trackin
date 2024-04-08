import * as React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import MainModal from '../../ui-component/modals/MainModal.js'
import DataGridApp from "../../ui-component/grid/DataGridApp"
import { modeContext } from '../../context/modeContext'

const ModalSelectItem = ({
    open = false,
    handleClose = () => { },
    handleSelectedArticle = () => { },
    method = 'GET',
    url = '',
    columns = [],
    param = {},
    title = 'Lista de Articulos'
}) => {
    const { token, tokenCompany } = React.useContext(modeContext)
    const [list, setList] = React.useState([])
    React.useEffect(() => {
        if (open) {
            setList([])
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
    }, [open, url, method, param, token, tokenCompany])

    const handleSelected = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = list.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            handleClose()
            handleSelectedArticle(selectedRowData)
        }
    }

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-article"
            aria_describedby="modal-find-pick-article"
        >
            <Typography id="modal-find-article" variant="h3" component="h2">
                {title}
            </Typography>
            <DataGridApp
                rows={list}
                columns={columns}
                onSelectionModelChange={handleSelected}
            />
        </MainModal>
    )
}

ModalSelectItem.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSelectedArticle: PropTypes.func,
}

export default ModalSelectItem