// src/app/catalogo/produto/[id]/page.js
'use client';

import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { API } from '../../../configs/general';
import { useRouter } from 'next/navigation'; // Import useRouter


function ProductPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const params = useParams();
  const productId = params.id;
  const [zoom, setZoom] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter(); // Initialize useRouter
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://${API}/products/${productId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar produto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        // Tratar erro (ex: exibir mensagem para o usuário)
      }
    };

    fetchProduct();
  }, [productId]);

  const handleZoom = () => {
    setZoom(!zoom);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleAddToCart = (isComprar) => {
    let cart = [];

    if(isComprar){
      try {
        cart = JSON.parse(sessionStorage.getItem('carrinho')) || [];
      } catch (error) {
        console.error("Erro ao ler carrinho da sessionStorage:", error);
        cart = [];
      }
    
      const existingProductIndex = cart.findIndex(item => item.id === parseInt(productId));
    
      if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantidade += quantity;
      } else {
        cart.push({ id: parseInt(productId), quantidade: quantity });
      }
    
      sessionStorage.setItem('carrinho', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      router.push('/catalogo/carrinho')
    } else {
      try {
        cart = JSON.parse(sessionStorage.getItem('carrinho')) || [];
      } catch (error) {
        console.error("Erro ao ler carrinho da sessionStorage:", error);
        cart = [];
      }
    
      const existingProductIndex = cart.findIndex(item => item.id === parseInt(productId));
    
      if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantidade += quantity;
      } else {
        cart.push({ id: parseInt(productId), quantidade: quantity });
      }
    
      sessionStorage.setItem('carrinho', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    }


  };
  

  

  // Placeholder data enquanto o produto está sendo carregado
  if (!product) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5">Carregando...</Typography>
      </Box>
    );
  }

  // Assumindo que a API pode não retornar um rating, reviews, etc.
  const rating = product.rating || 4.5; // Valor padrão
  const reviews = product.reviews || 0; // Valor padrão
  const maxQuantity = product.stockQuantity > 0 ? product.stockQuantity : 1; // Define a quantidade máxima com base em stockQuantity. Se for 0, ele vira 1.
  
  // Cria um array com as opções de quantidade
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        {/* Coluna da Imagem */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: zoom ? 'auto' : { xs: '300px', md: '450px' },
              overflow: 'hidden',
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '4px',
              cursor: 'zoom-in',
            }}
            onClick={handleZoom}
          >
            <Image
              src={'/600x400.svg'} // Substitua pela URL real da imagem, se disponível na API
              alt={product.nameProduct}
              width={zoom ? 1200 : 600}
              height={zoom ? 800 : 400}
              style={{ objectFit: zoom ? 'contain' : 'contain' }}
            />
            {!zoom && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                <ZoomInIcon />
              </IconButton>
            )}
          </Box>
        </Grid>

        {/* Coluna de Informações do Produto */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}
          >
            {product.nameProduct}
          </Typography>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Preço */}
          <Box sx={{ my: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
            >
              R${product.productValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" gutterBottom color={theme.palette.text.secondary}>
              À vista no Pix e boleto
            </Typography>
            <Typography variant="body2" gutterBottom color={theme.palette.text.secondary}>
              Ou em até 10x de R${(product.productValue / 10).toFixed(2)} sem juros
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Descrição */}
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
            Descrição do Produto
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {product.productDescription}
          </Typography>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Informações Adicionais */}
          {product.additionalInfo && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                Informações Adicionais
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                {product.additionalInfo}
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            </>
          )}

          {/* Especificações Técnicas */}
          {product.technicalDetails && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                Especificações Técnicas
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Modelo: {product.productModel}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Vazão: {product.technicalDetails.flow}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Pressão: {product.technicalDetails.pressure}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Rotação: {product.technicalDetails.rotation}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Potência: {product.technicalDetails.power}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Temperatura: {product.technicalDetails.temperature}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Peso: {product.technicalDetails.weight}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Capacidade de Óleo: {product.technicalDetails.oilCapacity}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Entrada: {product.technicalDetails.inlet}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Saída: {product.technicalDetails.outlet}
              </Typography>
              {/* Adicione outros detalhes técnicos conforme necessário */}
              <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            </>
          )}
        </Grid>

        {/* Coluna de Compra */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '8px',
              p: 3,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              ...(isMobile && {
                textAlign: 'center',
              }),
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
            >
              R$
              {product.productValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </Typography>
            {/* Aqui você pode adicionar informações de frete, se aplicável */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              {/* Status de estoque, se aplicável */}
            </Typography>

            {/* Quantidade */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom color={theme.palette.text.secondary}>
                Quantidade:
              </Typography>
              <select
                value={quantity}
                onChange={handleQuantityChange}
                style={{ marginTop: '5px', padding: '5px' }}
              >
                {quantityOptions.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </Box>

            <Button
              onClick={handleAddToCart}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                mb: 2,
                width: '100%',
              }}
            >
              Adicionar ao Carrinho
            </Button>
            <Button
              onClick={() => {handleAddToCart(true)}}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
                width: '100%',
              }}
            >
              Comprar Agora
            </Button>

            <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

            {/* Informações de envio e venda, se aplicável */}
          </Box>
        </Grid>
      </Grid>

      {/* Aqui você pode adicionar um slider de produtos recomendados ou outras seções, se desejar */}
    </Box>
  );
}

export default ProductPage;
