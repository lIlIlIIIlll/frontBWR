// ProductCard.js
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter


function ProductCard({
  product,
  pai,
  isCarrinho,
  quantity: propQuantity,
  onQuantityChange,
  onRemove,
}) {
  const MAX_DESCRIPTION_LENGTH = 80;
  const router = useRouter(); // Initialize useRouter

  // Usar propQuantity se disponível, caso contrário, usar 1 como padrão
  const quantity = propQuantity || 1;

  const truncateDescription = (description) => {
    if (!pai || description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    }
    const truncatedText = description.substring(0, MAX_DESCRIPTION_LENGTH);
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    return truncatedText.substring(0, lastSpaceIndex) + "...";
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0) {
      onQuantityChange(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  const handleAddToCartAndRedirect = () => {
    let cart = [];
    try {
      cart = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    } catch (error) {
      console.error("Erro ao ler carrinho da sessionStorage:", error);
      cart = [];
    }
  
    const existingProductIndex = cart.findIndex(item => item.id === parseInt(product.id));
  
    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantidade += 1; // Adiciona 1 unidade
    } else {
      cart.push({ id: parseInt(product.id), quantidade: 1 }); // Adiciona o produto com quantidade 1
    }
  
    sessionStorage.setItem('carrinho', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    router.push('/catalogo/carrinho'); // Redireciona para a página do carrinho
  };

  return (
    <Card
      sx={{
        maxWidth: pai === "grid" ? 345 : "100%",
        maxHeight: 345,
        display: pai === "grid" ? "block" : "flex",
        width: isCarrinho ? {xs:"98%", md:"95%"} : undefined,
        height: pai === "grid" ? { sm: "1%", md: "100%" }: 120,
        margin: isCarrinho ? "0 auto" : undefined,
        flexDirection: isCarrinho ? "row" : undefined,
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: isCarrinho ? "150px" : "100%",
          height: isCarrinho ? "150px" : "140px",
          objectFit: isCarrinho ? "contain" : "cover",
        }}
        image={product.image}
        alt={product.nameProduct}
      />
      <CardContent
        sx={{
          flexGrow: isCarrinho ? 1 : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: isCarrinho ? "70%" : undefined,
          minHeight: isCarrinho ? undefined : "140px",
          // Ajustes para mobile no carrinho
          p: isCarrinho ? { xs: 1, sm: 2 } : undefined, // Reduzindo o padding
        }}
      >
        <Stack
          direction={{ md: pai ? undefined : "row" }}
          justifyContent={"space-between"}
          alignItems={{ xs: "flex-start", sm: "center" }} // Alinhamento para mobile
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontSize: { xs: "1rem", sm: "1rem" }, // Reduzindo o tamanho da fonte
            }}
          >
            {product.nameProduct}
          </Typography>
          {!pai && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.7rem", sm: "1rem" }, // Reduzindo o tamanho da fonte
              }}
            >
              {"R$" + product.price}
            </Typography>
          )}
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: { xs: 0.5, sm: 1 }, // Reduzindo a margem superior
            fontSize: { xs: "0.6rem", sm: "0.9rem" }, // Reduzindo o tamanho da fonte
          }}
        >
          {product.productDescription ? truncateDescription(product.productDescription):""}
        </Typography>
      </CardContent>
      {pai && (
        <CardActions sx={{display: "flex", justifyContent: "space-between" }}>
          <div>
            {/* <Link href={`/catalogo/produto/${product.id}`} > */}
              <Button
                sx={{ marginRight: "10px" }}
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleAddToCartAndRedirect} // Usa a função que adiciona ao carrinho e redireciona
              >
                Comprar
              </Button>
            {/* </Link> */}
            <Link href={`/catalogo/produto/${product.id}`} >
              <Button size="small" color="secondary">
                Detalhes
              </Button>
            </Link>
          </div>
          <Typography
            marginLeft={1}
            variant="body1"
            color="text.secondary"
            fontWeight={"bold"}
          >
            {"R$" + product.price}
          </Typography>
        </CardActions>
      )}

      {/* Controles de quantidade (apenas para carrinho) */}
      {isCarrinho && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ml: "auto",
            // Ajustes para mobile no carrinho
          }}
        >
          <IconButton
            size="small"
            onClick={
              quantity === 1
                ? handleRemove
                : () => handleQuantityChange(quantity - 1)
            }
            sx={{
              p: 0.5, // Reduzindo o padding
            }}
          >
            {quantity === 1 ? <DeleteIcon /> : <RemoveIcon />}
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              m: { xs: 0, sm: "0 5px" }, // Ajustando a margem
              fontSize: { xs: "0.9rem", sm: "1rem" }, // Reduzindo o tamanho da fonte
            }}
          >
            {quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(quantity + 1)}
            sx={{
              p: 0.5, // Reduzindo o padding
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );
}

export default ProductCard;