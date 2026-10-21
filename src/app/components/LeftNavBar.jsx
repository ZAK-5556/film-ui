import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import * as authorities from 'constants/authorities';
import * as pages from 'constants/pages';
import IconFilms from 'components/icons/Films';
import IconButton from 'components/IconButton/IconButton';
import IconLockOpen from 'components/icons/LockOpen';
import IconMenu from 'components/icons/Menu';
import Link from 'components/Link';
import MenuItem from 'components/MenuItem';
import pagesURLs from 'constants/pagesURLs';
import React, { useMemo, useState } from 'react';
import SwipeableDrawer from 'components/SwipeableDrawer';
import Typography from 'components/Typography';
import useAccessValidate from 'misc/hooks/useAccessValidate';
import useTheme from 'misc/hooks/useTheme';

const getClasses = createUseStyles((theme) => ({
  menuHeaderSpace: {
    height: theme.header.height,
  },
}));

// Items without neededAuthorities are available to everyone
const menuItems = [
  {
    icon: <IconFilms />,
    link: `${pagesURLs[pages.filmList]}`,
    titleIntlId: `page.${pages.filmList}`,
  },
  {
    icon: <IconLockOpen />,
    link: `${pagesURLs[pages.secretPage]}`,
    neededAuthorities: [authorities.ENABLE_SEE_SECRET_PAGE],
    titleIntlId: `page.${pages.secretPage}`,
  },
];

function LeftNavBar() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const accessValidate = useAccessValidate();
  const classes = getClasses({ theme });
  const [state, setState] = useState({
    isNavMenuOpened: false,
  });

  const onClose = () => setState({
    ...state,
    isNavMenuOpened: false,
  });

  const filteredItems = useMemo(
    () => menuItems.filter(item => !item.neededAuthorities
      || accessValidate(item.neededAuthorities)),
    [accessValidate],
  );

  if (!filteredItems.length) {
    return;
  }

  return (
    <>
      <IconButton
        colorVariant="header"
        onClick={() => setState({
          ...state,
          isNavMenuOpened: true,
        })}
      >
        <IconMenu
          color="header"
          size={32}
        />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        isOpened={state.isNavMenuOpened}
        onClose={onClose}
      >
        <div className={classes.menuHeaderSpace} />
        {filteredItems.map(menuItem => (
          <Link
            key={menuItem.link}
            onClick={onClose}
            to={{
              pathname: menuItem.link,
            }}
          >
            <MenuItem>
              {menuItem.icon}
              <Typography variant="subTitle">
                {formatMessage({ id: menuItem.titleIntlId })}
              </Typography>
            </MenuItem>
          </Link>
        ))}
      </SwipeableDrawer>
    </>
  );
}

export default LeftNavBar;
