// src/app/perfil/page.js
'use client';

import { useState, useEffect, Fragment } from 'react';
import { API } from '../configs/general';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    useMediaQuery,
    Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthContext.js';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';


const PerfilPage = () => {
    const router = useRouter();
    const { userData, isLoggedIn, token, authLoading } = useAuth(); // Get authLoading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [orderHistory, setOrderHistory] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editedOrderName, setEditedOrderName] = useState('');


    useEffect(() => {
        const fetchOrders = async () => {
            if (isLoggedIn && token) { // Ensure token is also available
                try {
                    const response = await fetch(`https://${API}/orders`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to fetch orders");
                    }

                    const data = await response.json();
                    setOrderHistory(data);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            } else if (!isLoggedIn && !authLoading) { // Redirect only if not loading and not logged in
                router.push('/registro');
            }
        };

        if (!authLoading) { // Fetch orders only when authLoading is false
            fetchOrders();
        }
    }, [isLoggedIn, token, router, API, authLoading]); // Add authLoading to dependencies

    const handleEditClick = (orderId, currentOrderName) => {
        setEditingOrderId(orderId);
        setEditedOrderName(currentOrderName);
    };

    const handleSaveClick = async (orderId) => {
        if (isLoggedIn && token) {
            try {
                const response = await fetch(`https://${API}/orderUpdateName/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderName: editedOrderName }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update order name");
                }

                const updatedOrderHistory = orderHistory.map((order) => {
                    if (order.id === orderId) {
                        return { ...order, orderName: editedOrderName };
                    }
                    return order;
                });
                setOrderHistory(updatedOrderHistory);
                setEditingOrderId(null);
            } catch (error) {
                setError(error);
            }
        }
    };


    const handleCancelClick = () => {
        setEditingOrderId(null);
    };

    const handleOrderNameChange = (event) => {
        setEditedOrderName(event.target.value);
    };

    if (authLoading || loading) { // Show loading if auth is loading OR orders are loading
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="error">{error.message}</Alert>
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">
                    Dados do perfil não encontrados. Faça login novamente.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: { md: 30 }, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh' }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: '800px', borderRadius: '8px' }}>
                <Typography variant="h4" align="center" gutterBottom>Meu Perfil</Typography>

                <Box sx={{ mt: 2, mb: 4, '& > *': { mb: 1 } }}>
                    <Typography variant="body1"><strong>Nome:</strong> {userData.name}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
                    <Typography variant="body1"><strong>Celular:</strong> {userData.cellphone}</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h5" gutterBottom>Histórico de Pedidos</Typography>

                {orderHistory.length > 0 ? (
                    <List>
                        {orderHistory.map((order) => (
                            <Box key={order.id} sx={{ mb: 2 }}>
                                <Accordion disableGutters>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${order.id}-content`}
                                        id={`panel${order.id}-header`}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            flexDirection: isMobile ? 'column' : 'row',
                                            gap: isMobile ? 1 : 0,
                                            padding: '0 16px'
                                        }}
                                    >
                                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', width: '100%', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                                            {editingOrderId === order.id ? (
                                                <TextField
                                                    value={editedOrderName}
                                                    onChange={handleOrderNameChange}
                                                    size="small"
                                                    fullWidth={isMobile}
                                                    sx={{ mr: isMobile ? 0 : 2, mb: isMobile ? 1 : 0 }}
                                                />
                                            ) : (
                                                <Typography variant="body1" sx={{ mr: 2, wordBreak: 'break-word' }}>
                                                    {order.orderName}
                                                </Typography>
                                            )}
                                            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>R$ {order.orderTotalValue}</Typography>
                                        </Box>
                                        {editingOrderId === order.id ? (
                                            <Box sx={{ display: 'flex', gap: 1, mt: isMobile ? 1 : 0, width: '100%', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                                                <IconButton edge="end" aria-label="save" onClick={() => handleSaveClick(order.id)}>
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="cancel" onClick={handleCancelClick}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(order.id, order.orderName)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: isMobile ? '8px' : '16px' }}>
                                        <List>
                                            {order.orderItems.map((item) => (
                                                <Fragment key={item.id}>
                                                    <ListItem sx={{ paddingLeft: 0 }}>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                                                                    {/* Alteração aqui: Usar nameProduct */}
                                                                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{item.product.nameProduct}</Typography>
                                                                    <Typography variant="body1">
                                                                        {item.quantity} x R$ {item.itemValue} = R$ {item.totalValue}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider />
                                                </Fragment>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Você ainda não fez nenhuma compra.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default PerfilPage;