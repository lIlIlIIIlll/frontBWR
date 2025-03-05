'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  CircularProgress,
  useMediaQuery,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { API } from '../../../configs/general';

// Importações para o DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isValid } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';


const CheckoutPage = () => {
  const { token } = useAuth()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cep, setCep] = useState('');
  const [freight, setFreight] = useState(0);
  const [isFreightLoading, setIsFreightLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: null,
    cvv: '',
    brand: '', // Adicionado o campo 'brand'
  });
  const [expiryError, setExpiryError] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const router = useRouter();

    // Opções de bandeira do cartão
  const cardBrands = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'hipercard', label: 'Hipercard' },
    { value: 'elo', label: 'Elo' },
    { value: 'hiper', label: 'Hiper' },
  ];

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const cart = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
        const productPromises = cart.map(async (item) => {
          const response = await fetch(`https://${API}/products/${item.id}`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar produto ${item.id}`);
          }
          const productData = await response.json();
          return { ...productData, quantity: item.quantidade };
        });

        const fetchedProducts = await Promise.all(productPromises);
        setCartItems(fetchedProducts.filter((product) => product !== null));
      } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    let newTotal = 0;
    cartItems.forEach((product) => {
      newTotal += product.productValue * product.quantity;
    });
    setTotal(newTotal);
  }, [cartItems]);

  const handleCepChange = (event) => {
    setCep(event.target.value);
  };

  const calculateFreight = () => {
    setIsFreightLoading(true);
    setTimeout(() => {
      if (cep.length === 8) {
        const firstDigit = parseInt(cep[0]);
        if (firstDigit >= 0 && firstDigit <= 2) {
          setFreight(15);
        } else {
          setFreight(25);
        }
      } else {
        setFreight(0);
      }
      setIsFreightLoading(false);
    }, 1000);
  };

  useEffect(() => {
    calculateFreight();
  }, [cep]);

    const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
    // Reset da brand ao mudar o método de pagamento.  Importante para a validação.
    if (event.target.value !== 'credit' && event.target.value !== 'debit') {
      setCardData({ ...cardData, name: '', number: '', expiry: null, cvv: '', brand: '' });
    }
  };

  const handleCardInputChange = (event) => {
    setCardData({
      ...cardData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExpiryChange = (newValue) => {
    setCardData({ ...cardData, expiry: newValue });

    if (newValue && isValid(newValue)) {
      const formatted = format(newValue, 'MM/yy', { locale: ptBR });
      setExpiryError(formatted.length !== 5);
    } else {
      setExpiryError(true);
    }
  };

  const formattedExpiry = cardData.expiry
    ? format(cardData.expiry, 'MM/yy', { locale: ptBR })
    : '';

  const grandTotal = total + freight;
  const formattedGrandTotal = grandTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleConfirmOrder = async () => {
    setCheckoutError(null);
    setIsCheckoutLoading(true);

    let payload = {
      produtos: cartItems.map((item) => ({ id: item.id, quantidade: item.quantity })),
      frete: freight,
      referencia: `7744867891011123`,
    };

    if (paymentMethod === 'pix') {
      payload.metodoPagamento = 'pix';
    } else if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      payload.metodoPagamento = paymentMethod;

      // Validação completa para cartão:
      if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv || !cardData.brand) {
        setCheckoutError('Preencha todos os dados do cartão, incluindo a bandeira.');
        setIsCheckoutLoading(false);
        return;
      }

      const expiryMonth = String(cardData.expiry.getMonth() + 1).padStart(2, '0');
      const expiryYear = String(cardData.expiry.getFullYear());
        // Formato MM/AA (dois dígitos para o ano)
      const shortExpiryYear = expiryYear.slice(-2);


      payload.dadosCartao = {
        cardholderName: cardData.name,
        cardNumber: cardData.number,
        expirationDate: `${expiryMonth}/${shortExpiryYear}`, // Formato MM/AA
        expirationMonth: parseInt(expiryMonth, 10), // Inteiro
        expirationYear: parseInt(expiryYear, 10),   // Inteiro
        securityCode: cardData.cvv,
        brand: cardData.brand,
      };

    } else {
      setCheckoutError('Selecione um método de pagamento.');
      setIsCheckoutLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${API}/Checkout/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setCheckoutSuccess(true);
        sessionStorage.removeItem('carrinho');
        window.dispatchEvent(new Event('storage'));
        router.push('/');
      } else {
        const errorData = await response.json();
        setCheckoutError(errorData.message || 'Erro ao processar o pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      setCheckoutError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pt: '113px', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, width: { xs: '100%', md: '800px' }, borderRadius: '8px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finalizar Compra
        </Typography>

        {checkoutSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Pedido realizado com sucesso!
          </Alert>
        )}

        {checkoutError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {checkoutError}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Seu carrinho está vazio.
          </Typography>
        ) : (
          <>
            <Stack spacing={2} sx={{ mt: 4 }}>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">{item.nameProduct}</Typography>
                    <Typography variant="body2">Quantidade: {item.quantity}</Typography>
                  </Box>
                  <Typography variant="body1">
                    {(item.productValue * item.quantity).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField
                label="CEP"
                variant="outlined"
                value={cep}
                onChange={handleCepChange}
                placeholder="Digite o CEP"
                inputProps={{ maxLength: 8 }}
              />
              <Typography variant="body1">
                Frete:{' '}
                {isFreightLoading ? (
                  <>
                    Calculando... <CircularProgress size={16} sx={{ ml: 1 }} />
                  </>
                ) : (
                  freight > 0
                    ? freight.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'Informe o CEP'
                )}
              </Typography>
            </Box>

            <FormControl component="fieldset" sx={{ mt: 2, mb: 3 }}>
              <FormLabel component="legend">Forma de Pagamento</FormLabel>
              <RadioGroup
                row={!isMobile}
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <FormControlLabel value="credit" control={<Radio />} label="Cartão de Crédito" />
                <FormControlLabel value="debit" control={<Radio />} label="Cartão de Débito" />
                <FormControlLabel value="pix" control={<Radio />} label="Pix" />
              </RadioGroup>
            </FormControl>

            {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Dados do Cartão
                </Typography>
                <TextField
                  fullWidth
                  label="Nome no Cartão"
                  variant="outlined"
                  margin="normal"
                  name="name"
                  value={cardData.name}
                  onChange={handleCardInputChange}
                />
                <TextField
                  fullWidth
                  label="Número do Cartão"
                  variant="outlined"
                  margin="normal"
                  name="number"
                  value={cardData.number}
                  onChange={handleCardInputChange}
                />
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                        label="Validade"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        format="MM/yy"
                        views={['month', 'year']}
                        slotProps={{
                            textField: {
                            variant: 'outlined',
                            margin: 'normal',
                            error: expiryError,
                            helperText: expiryError ? 'Formato inválido (MM/AA)' : '',
                            fullWidth: isMobile,
                            sx: { width: isMobile ? '100%' : 'auto' }, // Auto width para o DatePicker
                            },
                            localeText: {
                            cancelButtonLabel: 'Cancelar',
                            okButtonLabel: 'OK',
                            start: 'Começo',
                            end: 'Fim',
                            previousMonth: 'Mês anterior',
                            nextMonth: 'Próximo mês',
                            openPreviousView: 'Abrir visualização anterior',
                            openNextView: 'Abrir próxima visualização',
                            calendarViewSwitchingButtonAriaLabel: (view) =>
                                view === 'year'
                                ? 'Visualização do ano, mude para visualização do calendário'
                                : 'Visualização do calendário, mude para visualização do ano',
                            },
                        }}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="CVV"
                        variant="outlined"
                        margin="normal"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        sx={{ width: isMobile ? '100%' : 'auto' }}
                    />

                    <FormControl  sx={{ minWidth: 120, mt: isMobile ? 0 : 2 }}> {/* Adicionado FormControl */}
                        <InputLabel id="brand-label">Bandeira</InputLabel>
                        <Select
                        labelId="brand-label"
                        id="brand"
                        name="brand"
                        value={cardData.brand}
                        label="Bandeira"
                        onChange={handleCardInputChange}
                        >
                        {cardBrands.map((brand) => (
                            <MenuItem key={brand.value} value={brand.value}>
                            {brand.label}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Total:</Typography>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
                {formattedGrandTotal}
              </Typography>
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                onClick={handleConfirmOrder}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Pedido'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                href="/catalogo/carrinho"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Voltar ao Carrinho
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CheckoutPage;