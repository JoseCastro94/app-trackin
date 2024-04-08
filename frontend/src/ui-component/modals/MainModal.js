import PropTypes from 'prop-types'
import { forwardRef } from 'react'

// material-ui
import { Modal, Box, } from '@mui/material'

// Redux
import { useSelector } from 'react-redux'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: 'background.paper',
    boxShadow: 24,
    p: 4,
}

const MainModal = forwardRef(
    (
        {
            aria_labelledby = "modal-modal-title",
            aria_describedby = "modal-modal-description",
            open = () => { },
            onClose = () => { },
            children,
            styleBody,
            ...others
        },
        ref
    ) => {
        const customization = useSelector((state) => state.customization)
        return (
            <Modal
                ref={ref}
                open={open}
                onClose={onClose}
                aria-labelledby={aria_labelledby}
                aria-describedby={aria_describedby}
                {...others}
            >
                <Box sx={{ borderRadius: `${customization.borderRadius}px`, ...style, ...styleBody }}>
                    {children}
                </Box>
            </Modal>
        );
    }
)

MainModal.propTypes = {
    aria_labelledby: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    aria_describedby: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default MainModal
