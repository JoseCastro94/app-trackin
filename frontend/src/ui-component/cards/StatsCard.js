import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';


// ==============================|| CUSTOM MAIN CARD ||============================== //

const StatsCard = forwardRef(
    (
        {
            title = "",
            color = "",
            number = 0,
            borderRadius = '14px',
            ...others
        },
        ref
    ) => {
        const theme = useTheme()

        return (
            <Box
                sx={{ p: 1 }}
                ref={ref}
                {...others}
            >
                <List sx={{ py: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                        <ListItemText
                            sx={{
                                textAlign: 'center',
                                backgroundColor: color,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: borderRadius,
                                marginRight: 1,
                                width: 4
                            }}
                            primary={<Typography variant="h2" sx={{ color: theme.palette.primary.light }}>{number}</Typography>}
                        />
                        <ListItemText
                            sx={{
                                py: 0,
                                mt: 0.45,
                                mb: 0.45,
                                marginLeft: 1
                            }}
                            primary={<Typography variant="h4" sx={{ color: theme.palette.primary.main }}>{title}</Typography>}
                        />
                    </ListItem>
                </List>
            </Box>
        )
    }
)

StatsCard.propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    color: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    number: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
};

export default StatsCard;