import React, { useContext } from 'react'

// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';

// modeContext
import { modeContext } from '../../../../context/modeContext'

//


// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({drawerOpen}) => {
    const { navigation } = useContext(modeContext)
    const navItems = navigation.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup drawerOpen={drawerOpen} key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
