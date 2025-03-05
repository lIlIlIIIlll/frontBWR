// Navbar.js (Corrigido)
"use client";

import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Button,
    TextField,
    Drawer,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { alpha } from '@mui/material/styles';
import { useAuth } from '../components/AuthContext.js';

const LOGO_PATH = "/marca.png";

export default function Navbar() {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [cartItemCount, setCartItemCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [appBarHovered, setAppBarHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { isLoggedIn, logout, userData } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);
    const isAdmin = userData?.email === "admin@admin.com";


    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const checkCartItems = () => {
        let counter = 0;
        JSON.parse(sessionStorage.getItem('carrinho') || '[]').forEach((item) => {
            counter += item.quantidade;
        });
        setCartItemCount(counter);
    };

    const handleLogout = () => {
        logout();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // **Modificado: handleSearchSubmit agora atualiza a URL diretamente**
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (pathname.startsWith('/catalogo')) {
            const params = new URLSearchParams();
            if (searchTerm) {
                params.append('search', searchTerm);
            }
             // Não se preocupe mais com o estado filters aqui
            router.push(`/catalogo?${params.toString()}`);
        }
        setSearchExpanded(false);
    };

    const toggleSearchExpansion = () => {
        setSearchExpanded(!searchExpanded);
        if (!searchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    useEffect(() => {
        checkCartItems();
        setMounted(true);
        window.addEventListener('storage', checkCartItems);

        return () => {
            window.removeEventListener('storage', checkCartItems);
        };
    }, []); // useEffect agora é mais simples


    let buttonstyle = {
        color: appBarHovered ? "#fff" : pathname.startsWith('/catalogo') ? '#fff' : "#FF",
        transition: "0.3s",
        fontWeight: 'bold',
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "#ffffff",
        },
        ml: 2,
    }

    return (
        <>
            {mounted && (
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        background: { xs: theme.palette.secondary.main, md: pathname.startsWith('/catalogo') ? theme.palette.secondary.main : `linear-gradient(to bottom, ${alpha(theme.palette.secondary.main, 1)}, ${alpha(theme.palette.secondary.main, 0)})` },
                        transition: { md: "background-color 0.7s ease-in-out" },
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                        },
                        "&:hover::before": {
                            transform: "translateY(0)",
                        },
                    }}
                    onMouseEnter={() => setAppBarHovered(true)}
                    onMouseLeave={() => setAppBarHovered(false)}
                >
                    <Toolbar>
                        {/* Menu Hamburguer (Mobile) */}
                        <Box sx={{ display: { xs: "block", md: "none" }, mr: 1 }}>
                            <IconButton
                                size="large"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Logo */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: { xs: "center", md: "flex-start" },
                                flexGrow: { xs: 1, md: 0 },
                                mr: { xs: 0, md: 0 },
                            }}
                        >
                            <Link href="/">
                                <Image
                                    src={LOGO_PATH}
                                    alt="Logo"
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "contain" }}
                                />
                            </Link>
                        </Box>

                        {/* Campo de Busca (Expansível em Mobile, Fixo em Desktop) */}
                        {pathname.startsWith("/catalogo") && (
                            <Box
                                component="form"
                                onSubmit={handleSearchSubmit}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center", // Added this line
                                    alignItems: "center",
                                    mx: { xs: 0, md: 0 },
                                    ml: { xs: 'auto', md: 0 },
                                    flexGrow: {md: 1}, //Added this line
                                }}
                            >
                                    {/* TextField */}
                                    <TextField
                                        inputRef={searchInputRef}
                                        placeholder="Pesquisar..."
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            backgroundColor: "#fff",
                                            borderRadius: "5px",
                                            width: { xs: searchExpanded ? '150px' : 0, sm: searchExpanded ? '200px' : 0, md: '500px' }, //changed this line
                                            maxWidth: { md: '500px' }, //Added this line
                                            transition: 'width 0.3s',
                                            display: { xs: 'none', md: 'block' },
                                            ...(!searchExpanded && {
                                                [theme.breakpoints.down('md')]: {
                                                    width: '0px',
                                                    padding: '0px',
                                                    margin: '0px',
                                                    border: '0px',
                                                    overflow: 'hidden'
                                                }
                                            })
                                        }}
                                        slotProps={{
                                            input:{
                                                style:{
                                                    width:'100%'
                                                }
                                            }
                                        }}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onBlur={() => setSearchExpanded(false)}
                                    />
                                     {/* TextField (Mobile - dentro do Collapse) */}
                                     <Collapse in={searchExpanded} timeout="auto" unmountOnExit sx={{display: { xs: 'block', md: 'none' }}}>
                                        <TextField
                                            inputRef={searchInputRef}
                                            placeholder="Pesquisar..."
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "5px",
                                                width: { xs: '150px', sm: '200px' },
                                                transition: 'width 0.3s',
                                            }}
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onBlur={() => setSearchExpanded(false)}
                                        />
                                    </Collapse>

                                    {/* IconButton */}
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        aria-label="search"
                                        onClick={toggleSearchExpansion}
                                        sx={{
                                            color: "#fff",
                                            borderRadius: "5px",
                                            padding: '10px',
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.light,
                                            },
                                            display: { xs: 'block', md: 'none' },
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                            </Box>
                        )}

                        {/* Menu Principal (Desktop) */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
                            <Link href="/" passHref>
                                <Button sx={buttonstyle}>
                                    Principal
                                </Button>
                            </Link>
                            <Link href="/catalogo" passHref>
                                <Button sx={buttonstyle}>
                                    Catálogo
                                </Button>
                            </Link>
                             {/* Exibe "Administração do Site" apenas se for admin */}
                            {isAdmin && (
                                <Link href="/admin" passHref>
                                    <Button sx={buttonstyle}>
                                        Administração do Site
                                    </Button>
                                </Link>
                            )}
                            <Link href="/contato" passHref>
                                <Button sx={buttonstyle}>
                                    Contato
                                </Button>
                            </Link>
                        </Box>

                        {/* Ícones (Usuário e Carrinho) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, md: 2 } }}>
                            {/* User Icon and Menu */}
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="user"
                                onClick={handleUserMenuOpen}
                                sx={{
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.light,
                                    },
                                }}
                            >
                                <AccountCircle sx={{ fontSize: 40 }} />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleUserMenuClose}
                            >
                                {!isLoggedIn && (
                                    <Link href="/registro" passHref>
                                        <MenuItem onClick={handleUserMenuClose}>
                                            Entrar/Cadastrar
                                        </MenuItem>
                                    </Link>
                                )}
                                {isLoggedIn && (
                                    <div>
                                        <Link href="/perfil" passHref>
                                            <MenuItem onClick={handleUserMenuClose}>Meu Perfil</MenuItem>
                                        </Link>
                                        <MenuItem onClick={handleLogout}>Sair</MenuItem>
                                    </div>
                                )}
                            </Menu>

                            {/* Cart Icon */}
                            {pathname.startsWith("/catalogo") && (
                                <Link href="/catalogo/carrinho" passHref>
                                    <IconButton
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        aria-label="cart"
                                        sx={{
                                            ml: 1,
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.light,
                                            },
                                        }}
                                    >
                                        <ShoppingCartIcon />
                                        {cartItemCount > 0 && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {cartItemCount}
                                            </Box>
                                        )}
                                    </IconButton>
                                </Link>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            {/* Drawer (Menu Mobile) */}
            {mounted && (
                <Drawer
                    anchor="left"
                    open={openDrawer}
                    onClose={handleDrawerToggle}
                    PaperProps={{
                        sx: {
                            backgroundColor: theme.palette.background.default,
                            boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
                            width: 250,
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            color: "black",
                        }}
                        role="presentation"
                        onClick={handleDrawerToggle}
                        onKeyDown={handleDrawerToggle}
                    >
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6">
                                Olá, {isLoggedIn ? (userData?.name || 'Usuário') : 'Visitante'}!
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Link href="/" passHref>
                            <Button
                                sx={{
                                    color: "black",
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.light,
                                        color: "#ffffff",
                                    },
                                    width: '100%',
                                    mb: 1,
                                    justifyContent: 'flex-start',
                                    pl: 2,
                                }}
                            >
                                Principal
                            </Button>
                        </Link>
                        <Link href="/catalogo" passHref>
                            <Button
                                sx={{
                                    color: "black",
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.light,
                                        color: "#ffffff",
                                    },
                                    width: '100%',
                                    mb: 1,
                                    justifyContent: 'flex-start',
                                    pl: 2,
                                }}
                            >
                                Catálogo
                            </Button>
                        </Link>
                        {/* Exibe "Administração do Site" apenas se for admin */}
                        {isAdmin && (
                        <Link href="/admin" passHref>
                             <Button
                                sx={{
                                    color: "black",
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.light,
                                        color: "#ffffff",
                                    },
                                    width: '100%',
                                    mb: 1,
                                    justifyContent: 'flex-start',
                                    pl: 2,
                                }}
                            >
                               Administração do Site
                            </Button>
                        </Link>
                        )}
                        <Link href="/contato" passHref>
                            <Button
                                sx={{
                                    color: "black",
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.light,
                                        color: "#ffffff",
                                    },
                                    width: '100%',
                                    mb: 1,
                                    justifyContent: 'flex-start',
                                    pl: 2,
                                }}
                            >
                                Contato
                            </Button>
                        </Link>

                        {!isLoggedIn && (
                            <Link href="/registro" passHref>
                                <Button
                                    sx={{
                                        color: "black",
                                        transition: "0.3s",
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.light,
                                            color: "#ffffff",
                                        },
                                        width: '100%',
                                        mb: 1,
                                        justifyContent: 'flex-start',
                                        pl: 2,
                                    }}
                                >
                                    Entrar/Cadastrar
                                </Button>
                            </Link>
                        )}
                        {isLoggedIn && (
                            <>
                                <Link href="/perfil" passHref>
                                    <Button
                                        sx={{
                                            color: "black",
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.light,
                                                color: "#ffffff",
                                            },
                                            width: '100%',
                                            mb: 1,
                                            justifyContent: 'flex-start',
                                            pl: 2,
                                        }}
                                    >
                                        Meu Perfil
                                    </Button>
                                </Link>
                                <Button onClick={handleLogout}
                                    sx={{
                                        color: "black",
                                        transition: "0.3s",
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.light,
                                            color: "#ffffff",
                                        },
                                        width: '100%',
                                        mb: 1,
                                        justifyContent: 'flex-start',
                                        pl: 2,
                                    }}
                                >
                                    Sair
                                </Button>
                            </>
                        )}
                    </Box>
                </Drawer>
            )}
        </>
    );
}