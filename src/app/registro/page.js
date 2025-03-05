// c:\Users\aaleo\Documents\Programming\React\bwr-redo-next\src\app\registro\page.js
'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  useMediaQuery,
  Alert,
  Collapse,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { API } from '../configs/general.js';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthContext.js';

function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  // Estados para os campos de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // Estado para erro de login
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Estados para os campos de cadastro
  const [name, setName] = useState('');
  const [cadastroEmail, setCadastroEmail] = useState('');
  const [cadastroPassword, setCadastroPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cadastroError, setCadastroError] = useState(null); // Estado para erro de cadastro
  const [cadastroSuccess, setCadastroSuccess] = useState(false);

  // Funções de validação
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (email, password) => {
    if (email !== "admin@admin.com") {
      return password.length >= 6;
    } else {
      return true;
    }
  };

  const validatePhoneNumber = (number) => {
    const re = /^\d{10,11}$/;
    return re.test(number);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null); // Limpa erro anterior
    setLoginSuccess(false);

    if (!validateEmail(loginEmail)) {
      setLoginError('Por favor, insira um email válido.');
      return;
    }
    if (!validatePassword(loginEmail, loginPassword)) {
      setLoginError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const response = await fetch(`https://${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        setLoginSuccess(true); // Define sucesso na tela
        setLoginError(null);

        //Redireciona se o login for bem sucedido.
        router.push('/');
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Erro ao fazer login. Verifique sua conexão.');
    }
  };

  const handleCadastro = async (event) => {
    event.preventDefault();
    setCadastroError(null); // Limpa erro anterior
    setCadastroSuccess(false);

    if (!name) {
      setCadastroError('Por favor, insira seu nome.');
      return;
    }
    if (!validateEmail(cadastroEmail)) {
      setCadastroError('Por favor, insira um email válido.');
      return;
    }
    if (!validatePassword(cadastroEmail, cadastroPassword)) {
      setCadastroError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (cadastroPassword !== confirmPassword) {
      setCadastroError('As senhas não coincidem.');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setCadastroError('Por favor, insira um número de telefone válido.');
      return;
    }

    try {
      const response = await fetch(`https://${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: cadastroEmail,
          password: cadastroPassword,
          cellphone: phoneNumber,
          secondCellphone: '',
          role: 'customer',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        setCadastroSuccess(true); // Define sucesso na tela
        setCadastroError(null);

        //Redireciona se o login for bem sucedido.
        router.push('/');

      } else {
        const errorData = await response.json();
        setCadastroError(errorData.error || 'Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setCadastroError('Erro ao cadastrar. Verifique sua conexão.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        p: 4,
        backgroundColor: theme.palette.background.default,
        pt: '113px',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: isMobile ? '100%' : 400,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? 'Login' : 'Cadastro'}
        </Typography>

        {/* Erros e Mensagens de Sucesso */}
        <Collapse in={loginError !== null || loginSuccess}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          {loginSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Login bem-sucedido! Redirecionando...
            </Alert>
          )}
        </Collapse>

        {isLogin && (
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              margin="normal"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin(e);
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              Entrar
            </Button>
            <Typography align="center">
              Não tem uma conta?{' '}
              <Link
                href="#"
                color="secondary"
                onClick={() => setIsLogin(false)}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        )}

        <Collapse in={cadastroError !== null || cadastroSuccess}>
          {cadastroError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cadastroError}
            </Alert>
          )}
          {cadastroSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Cadastro realizado com sucesso! Redirecionando...
            </Alert>
          )}
        </Collapse>

        {!isLogin && (
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleCadastro}>
            <TextField
              fullWidth
              label="Nome"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={cadastroEmail}
              onChange={(e) => setCadastroEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              margin="normal"
              value={cadastroPassword}
              onChange={(e) => setCadastroPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirmar Senha"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Número de Telefone"
              variant="outlined"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCadastro(e);
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              Cadastrar
            </Button>
            <Typography align="center">
              Já tem uma conta?{' '}
              <Link href="#" color="secondary" onClick={() => setIsLogin(true)}>
                Faça login
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default LoginPage;