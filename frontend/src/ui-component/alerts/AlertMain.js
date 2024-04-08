import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Typography,
    Modal,
    Avatar
} from '@mui/material'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'background.paper',
    boxShadow: 24,
    p: 4,
}

const AlertMain = ({ title, sub, icon }) => {
    const theme = useTheme()
    return (
        <Modal
            open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Avatar
                    sx={{ 
                        width: 100,
                        height: 100,
                        backgroundColor: 'inherit'
                    }}
                >
                    <CheckCircleIcon />
                </Avatar>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: theme.palette.primary.main }}>
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {sub}
                </Typography>
            </Box>
        </Modal>
    )
}

AlertMain.propTypes = {
    icon: PropTypes.string,
    sub: PropTypes.string,
    title: PropTypes.string
}

export default AlertMain