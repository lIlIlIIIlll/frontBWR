"use client";

import {
  Stack,
  Box,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import { useState, useEffect } from "react";
import { API } from '../../configs/general';
import Link from "next/link";


export default function Carrinho() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const cart = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
      const productPromises = cart.map(async (item) => {
        try {
          const response = await fetch(`https://${API}/products/${item.id}`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar produto ${item.id}`);
          }
          const productData = await response.json();
          return { ...productData, quantity: item.quantidade };
        } catch (error) {
          console.error(error);
          return null;
        }
      });

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts.filter(product => product !== null));
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let newTotal = 0;
    products.forEach((product) => {
      newTotal += product.productValue * product.quantity;
    });
    setTotal(newTotal);
  }, [products]);

  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  
    // Atualiza a variável de sessão 'carrinho'
    const cart = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantidade: newQuantity } : item
    );
    sessionStorage.setItem('carrinho', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleRemoveProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  
    // Atualiza a variável de sessão 'carrinho'
    const cart = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
    const updatedCart = cart.filter(item => item.id !== productId);
    sessionStorage.setItem('carrinho', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const truncateDescription = (description, isMobile) => {
    const MAX_DESCRIPTION_LENGTH = 80;

    if (isMobile && description?.length > MAX_DESCRIPTION_LENGTH) {
      const truncatedText = description.substring(0, MAX_DESCRIPTION_LENGTH);
      const lastSpaceIndex = truncatedText.lastIndexOf(" ");
      return truncatedText.substring(0, lastSpaceIndex) + "...";
    }
    return description;
  };

  return (
    <Box p={2} sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" gutterBottom>
        Carrinho de Compras
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box
          sx={{
            width: { xs: "100%", md: "69%" },
            backgroundColor: "#EAEDED",
            borderRadius: "4px",
            pl: {md:2,xs:1},
            pt: 2,
            border: "1px solid #ccc",
          }}
        >
          <Stack spacing={2}>
            <div style={{display:'flex',justifyContent:'end'}}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{
                  backgroundColor: "#EAEDED",
                  padding: "0 10px",
                  mr:12
                }}
              >
                Preço
              </Typography>
            </div>
            <Divider sx={{ width: "98%" }} />

            {/* Lista de ProductCards */}
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  nameProduct: product.nameProduct,
                  price: product.productValue,
                  image: "/600x400.svg",
                  productDescription: truncateDescription(product.productDescription, isMobile),
                }}
                isCarrinho={true}
                quantity={product.quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveProduct}
              />
            ))}

            <Divider sx={{ width: "100%" }} />

            {products.length === 0 && (
              <Typography variant="h6" align="center" sx={{ padding: "40px" }}>
                Seu carrinho está vazio.
              </Typography>
            )}

            <Typography variant="h6" align="right">
              Subtotal ({products.length} produtos):{" "}
              <span style={{ color: "#B12704" }}>{formattedTotal}</span>
            </Typography>
          </Stack>
        </Box>

        <Stack
          sx={{
            width: { xs: "100%", md: "25%" },
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 2,
            height: "fit-content",
          }}
        >
          <Typography variant="h6">
            Subtotal ({products.length} produtos):{" "}
            <span style={{ color: "#B12704" }}>{formattedTotal}</span>
          </Typography>
          <Link href="/catalogo/carrinho/checkout">
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                "&:hover": {},
              }}
            >
              Fechar Pedido
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}