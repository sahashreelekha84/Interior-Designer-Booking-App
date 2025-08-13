
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Tooltip, Avatar, Stack, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { useState } from 'react';
import Swal from 'sweetalert2';
// import SearchIcon from '@mui/icons-material/Search';
const pages = [{ name: "Home", path: '/' }, { name: 'About', path: '/about' }, { name: 'Contact', path: '/contact' }, { name: 'Design', path: '/design' }]
// const settings = [{name:'Profile',path:'/user/profile'},{name:'Dashboard',path:'/user/dashboard'}, {name:'Logout'}];
const getSettings = (role) => {
  if (role === "Designer") {
    return [
      { name: 'Profile', path: '/designer/profile' },
      { name: 'Dashboard', path: '/designer/dashboard' },
      { name: 'Logout' }
    ];
  } else {
    return [
      { name: 'Profile', path: '/user/profile' },
      { name: 'Dashboard', path: '/user/dashboard' },
      { name: 'Logout' }
    ];
  }
};

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const role = user?.role || localStorage.getItem('role');
  const settings = getSettings(role);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    if (setting.name === "Logout") {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('des_id')
      localStorage.removeItem('userId')
       localStorage.removeItem('designername')

      clearUser();
      Swal.fire("Logged Out", "You have been logged out successfully", "success");
      navigate("/user/login");
    }
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#8a5d3d' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Designer World
            </Typography>

            {/* Mobile nav menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem key={page.id} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Desktop nav buttons */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.id}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Avatar/Profile menu */}
            <Box sx={{ flexGrow: 0 }}>
              {user ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Tooltip title="Open settings">
                   {(user?.role === 'Designer' ? user?.username : user?.username)}
                  </Tooltip>
                  <Typography variant="subtitle1" color="white">

                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

                      <Avatar>
                        {(user?.role === 'Designer' ? user?.username.trim()?.charAt(0)?.toUpperCase() || 'D': user?.username)?.slice(0,1)}
                      </Avatar>

                      {/* src={`http://localhost:3005/${user?.profile || "static/images/avatar/2.jpg"}`} */}

                    </IconButton>
                  </Typography>

                  <Menu
                    sx={{ mt: '45px' }}
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                        <Typography textAlign="center" sx={{ textDecoration: 'none' }} component={Link} to={setting.path}>{setting.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Stack>
              ) : (
                <Button component={Link} to="/user/login" sx={{ color: '#fff' }}>
                  Login
                </Button>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}



export default Header;
