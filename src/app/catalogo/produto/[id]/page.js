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
  CircularProgress, // Import CircularProgress
} from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { API } from '../../../configs/general';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick'; // Import react-slick
import ProductCard from '../../../components/ProductCard'; // Import ProductCard
import "slick-carousel/slick/slick.css"; // Import slick css
import "slick-carousel/slick/slick-theme.css"; // Import slick theme css


function ProductPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const params = useParams();
  const productId = params.id;
  const [zoom, setZoom] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const [loadingRelated, setLoadingRelated] = useState(false); // Loading state for related products

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return; // Don't fetch if productId is not available yet
      try {
        const response = await fetch(`https://${API}/products/${productId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar produto');
        }
        const data = await response.json();
        setProduct(data);
        setQuantity(1); // Reset quantity when product changes
      } catch (error) {
        console.error(error);
        setProduct(null); // Reset product on error
        // Tratar erro (ex: exibir mensagem para o usuário, redirecionar)
      }
    };

    fetchProduct();
  }, [productId]); // Re-run when productId changes

  // Fetch related products when main product data is available
  useEffect(() => {
    const fetchRelatedProducts = async () => {
        // Ensure product and relatedProductIds exist and it's an array with items
        if (product && Array.isArray(product.relatedProductIds) && product.relatedProductIds.length > 0) {
            setLoadingRelated(true);
            try {
            const relatedProductPromises = product.relatedProductIds.map(id =>
                fetch(`https://${API}/products/${id}`).then(res => {
                if (!res.ok) {
                    console.warn(`Failed to fetch related product with ID: ${id}`);
                    return null; // Return null for failed fetches
                }
                return res.json();
                })
            );

            const relatedProductsData = await Promise.all(relatedProductPromises);
            setRelatedProducts(relatedProductsData.filter(p => p !== null)); // Filter out any null results

            } catch (error) {
            console.error("Erro ao buscar produtos relacionados:", error);
            setRelatedProducts([]); // Reset on error
            } finally {
            setLoadingRelated(false);
            }
        } else {
            setRelatedProducts([]); // Reset if no related IDs or product is null
        }
    };

    fetchRelatedProducts();
  }, [product]); // Re-run when the main product data changes

  const handleZoom = () => {
    setZoom(!zoom);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    const maxQuantity = product?.stockQuantity > 0 ? product.stockQuantity : 1;
    // Ensure quantity is within valid range
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    } else if (value < 1) {
        setQuantity(1);
    } else {
        setQuantity(maxQuantity);
    }
  };

  const handleAddToCart = (isComprar = false) => { // Default isComprar to false
    if (!product) return; // Don't proceed if product is not loaded

    let cart = [];
    try {
      cart = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    } catch (error) {
      console.error("Erro ao ler carrinho da sessionStorage:", error);
      cart = [];
    }

    const existingProductIndex = cart.findIndex(item => item.id === parseInt(productId));

    if (existingProductIndex >= 0) {
      // Ensure not exceeding stock when adding to existing item
      const newQuantity = cart[existingProductIndex].quantidade + quantity;
      const maxQuantity = product.stockQuantity > 0 ? product.stockQuantity : 1;
      cart[existingProductIndex].quantidade = Math.min(newQuantity, maxQuantity);

    } else {
      cart.push({ id: parseInt(productId), quantidade: quantity });
    }

    sessionStorage.setItem('carrinho', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage')); // Notify other parts of the app (like header cart count)

    if (isComprar) {
      router.push('/catalogo/carrinho'); // Redirect only if "Comprar Agora"
    }
    // Optionally, show a success message/toast notification here
  };

  // Slider settings for related products
  const sliderSettings = {
    dots: true,
    infinite: relatedProducts.length > 3, // Only infinite if more slides than slidesToShow
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: relatedProducts.length > 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: relatedProducts.length > 1,
        },
      },
    ],
  };


  // Placeholder data while the product is being loaded
  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate max quantity and options
  const maxQuantity = product.stockQuantity > 0 ? product.stockQuantity : 1;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  // Determine image URL - use placeholder if none provided
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '/600x400.svg'; // Use first image or placeholder

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: '70px', md: '88px' } }}> {/* Added top padding */}
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
              border: `1px solid ${theme.palette.divider}`, // Softer border
              borderRadius: '8px', // Rounded corners
              cursor: 'zoom-in',
              backgroundColor: '#f9f9f9' // Light background for image container
            }}
            onClick={handleZoom}
          >
            {/* Use Next.js Image for optimization */}
            <Image
              src={imageUrl} // Use dynamic image URL
              alt={product.nameProduct}
              width={zoom ? 1200 : 600} // Adjust sizes as needed
              height={zoom ? 800 : 400}
              style={{ objectFit: 'contain' }} // 'contain' is usually better for products
              priority // Prioritize loading the main product image
            />
            {!zoom && (
              <IconButton
                aria-label="Ampliar imagem"
                sx={{
                  position: 'absolute',
                  bottom: '10px', // Position bottom right
                  right: '10px',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <ZoomInIcon />
              </IconButton>
            )}
          </Box>
          {/* Simple image zoom indicator/instruction */}
          {!zoom && <Typography variant="caption" display="block" textAlign="center" sx={{mt: 1}}>Clique na imagem para ampliar</Typography>}
        </Grid>

        {/* Coluna de Informações do Produto */}
        <Grid item xs={12} md={4}>
          <Typography
            variant={isMobile ? "h5" : "h4"} // Adjust variant for mobile
            component="h1" // Semantic element
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
              {/* Format currency */}
              {product.productValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            <Typography variant="body2" gutterBottom color={theme.palette.text.secondary}>
              À vista no Pix e boleto
            </Typography>
            <Typography variant="body2" gutterBottom color={theme.palette.text.secondary}>
              Ou em até 10x de {(product.productValue / 10)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Descrição */}
          {product.productDescription && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                Descrição do Produto
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary} paragraph>
                {product.productDescription}
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            </>
          )}


          {/* Informações Adicionais */}
          {product.additionalInfo && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                Informações Adicionais
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary} paragraph>
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
              {/* Conditionally render each detail only if it exists */}
              {product.productModel && <Typography variant="body2" color={theme.palette.text.secondary}>Modelo: {product.productModel}</Typography>}
              {product.technicalDetails.flow && <Typography variant="body2" color={theme.palette.text.secondary}>Vazão: {product.technicalDetails.flow}</Typography>}
              {product.technicalDetails.pressure && <Typography variant="body2" color={theme.palette.text.secondary}>Pressão: {product.technicalDetails.pressure}</Typography>}
              {product.technicalDetails.rotation && <Typography variant="body2" color={theme.palette.text.secondary}>Rotação: {product.technicalDetails.rotation}</Typography>}
              {product.technicalDetails.power && <Typography variant="body2" color={theme.palette.text.secondary}>Potência: {product.technicalDetails.power}</Typography>}
              {product.technicalDetails.temperature && <Typography variant="body2" color={theme.palette.text.secondary}>Temperatura: {product.technicalDetails.temperature}</Typography>}
              {product.technicalDetails.weight && <Typography variant="body2" color={theme.palette.text.secondary}>Peso: {product.technicalDetails.weight}</Typography>}
              {product.technicalDetails.oilCapacity && <Typography variant="body2" color={theme.palette.text.secondary}>Capacidade de Óleo: {product.technicalDetails.oilCapacity}</Typography>}
              {product.technicalDetails.inlet && <Typography variant="body2" color={theme.palette.text.secondary}>Entrada: {product.technicalDetails.inlet}</Typography>}
              {product.technicalDetails.outlet && <Typography variant="body2" color={theme.palette.text.secondary}>Saída: {product.technicalDetails.outlet}</Typography>}
              <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            </>
          )}
        </Grid>

        {/* Coluna de Compra */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`, // Softer border
              borderRadius: '8px',
              p: 3,
              boxShadow: theme.shadows[2], // Subtle shadow
              ...(isMobile && {
                textAlign: 'center',
              }),
              backgroundColor: theme.palette.background.paper,
              position: 'sticky', // Make it sticky on larger screens
              top: '100px' // Adjust top offset based on header height
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
            >
              {/* Format currency */}
              {product.productValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>

            {/* Stock Info */}
            <Typography
              variant="body2"
              sx={{
                color: product.stockQuantity > 0 ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              {product.stockQuantity > 0 ? `${product.stockQuantity} em estoque` : 'Produto indisponível'}
            </Typography>

            {/* Quantidade */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mr: 1 }}>
                Quantidade:
              </Typography>
              <select
                value={quantity}
                onChange={handleQuantityChange}
                disabled={product.stockQuantity <= 0} // Disable if out of stock
                style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: product.stockQuantity <= 0 ? '#eee' : '#fff', // Indicate disabled state
                    cursor: product.stockQuantity <= 0 ? 'not-allowed' : 'pointer'
                 }}
                 aria-label="Selecione a quantidade"
              >
                {quantityOptions.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </Box>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(false)} // Pass false for "Add to Cart"
              variant="contained"
              disabled={product.stockQuantity <= 0} // Disable if out of stock
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white, // Ensure text is white
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '&:disabled': { // Style for disabled button
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled
                },
                mb: 2,
                width: '100%',
                py: 1.2 // Increase button padding
              }}
            >
              Adicionar ao Carrinho
            </Button>

            {/* Buy Now Button */}
            <Button
              onClick={() => handleAddToCart(true)} // Pass true for "Buy Now"
              variant="contained"
              disabled={product.stockQuantity <= 0} // Disable if out of stock
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
                 '&:disabled': { // Style for disabled button
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled
                },
                width: '100%',
                 py: 1.2 // Increase button padding
              }}
            >
              Comprar Agora
            </Button>

            {/* Optional: Add shipping info link or text */}
            {/* <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
            <Typography variant="caption" color="text.secondary">
              Informações de frete calculadas no carrinho.
            </Typography> */}
          </Box>
        </Grid>
      </Grid>

      {/* Related Products Section */}
      {(loadingRelated || relatedProducts.length > 0) && ( // Render section only if loading or has products
            <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Produtos Relacionados
                </Typography>
                {loadingRelated ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                    </Box>
                ) : relatedProducts.length > 0 ? (
                    // Apply negative margin to counteract padding inside slider items if needed
                    <Box sx={{ mx: { xs: -1, md: -2 } }}>
                        <Slider {...sliderSettings}>
                        {relatedProducts.map((relatedProduct) => (
                            <Box key={relatedProduct.id} sx={{ p: { xs: 1, md: 2 } }}> {/* Add padding around each card */}
                                <ProductCard
                                    product={relatedProduct}
                                    pai="grid" // Use grid style for cards in slider
                                    isCarrinho={false} // Not in cart context
                                />
                            </Box>
                        ))}
                        </Slider>
                    </Box>
                ) : null /* No message needed if it just finished loading and is empty */}
            </Box>
        )}

        {/* Zoomed Image Modal (Simple implementation) */}
        {zoom && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1300, // Ensure it's above other elements
                    cursor: 'zoom-out'
                }}
                onClick={handleZoom} // Close on click outside image
            >
                <Image
                    src={imageUrl}
                    alt={`Ampliado: ${product.nameProduct}`}
                    width={1200} // Or other large size
                    height={800}
                    style={{ objectFit: 'contain', maxHeight: '90vh', maxWidth: '90vw' }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                />
                 <IconButton
                    aria-label="Fechar zoom"
                    onClick={handleZoom}
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }
                    }}
                >
                    <ZoomInIcon sx={{ transform: 'rotate(180deg)'}} /> {/* Visual cue for zooming out */}
                 </IconButton>
            </Box>
        )}
    </Box>
  );
}

export default ProductPage;