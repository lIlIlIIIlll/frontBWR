// src/app/page.js (Corrected and Improved)
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Button,
  Drawer,
  IconButton,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import HeroSlider from '../components/HeroSlider';
import { API } from '../configs/general';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams, useRouter } from 'next/navigation';

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    // Mantém o estado filters
    rating: 'Tudo',
    minPrice: '',
    maxPrice: '',
    discount: 'Tudo',
    category: 'Tudo',
    subcategory: 'Tudo',
    search: '', // Mantém search, mas ele não será mais usado diretamente no useEffect de busca
  });
  const [productsFound, setProductsFound] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLoad = useRef(true); // useRef para evitar o efeito no carregamento inicial

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Atualiza o estado filters (para a Sidebar)
    setIsMobileFilterOpen(false);

    // Atualiza a URL (apenas com os filtros da Sidebar):
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== 'Tudo')
      params.append('category', newFilters.category);
    if (newFilters.subcategory && newFilters.subcategory !== 'Tudo')
      params.append('subcategory', newFilters.subcategory);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);

    // *NÃO* adiciona o search aqui.  O search vem da URL agora.

    router.push(`/catalogo?${params.toString()}`, { shallow: true });
  };

  const handleOpenMobileFilter = () => {
    setIsMobileFilterOpen(true);
  };

  const handleCloseMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProductsFound(true); // Reset productsFound
      setProducts([]); // Limpa produtos anteriores
      try {
        // Constrói a URL da API com base em *searchParams*:
        let url = `https://${API}/products?`;
        let categoryFilterActive = false;
        let subcategoryFilterActive = false;

        // Pega os parâmetros da URL:
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const searchQuery = searchParams.get('search') || ''; // Pega o search da URL

        if (subcategory && subcategory !== 'Tudo') {
          url = `https://${API}/subcategories/${subcategory}?include=products&productFields=id,nameProduct,productValue,productDescription`;
          subcategoryFilterActive = true;
        } else if (category && category !== 'Tudo') {
          url = `https://${API}/categories/${category}?include=products&productFields=id,nameProduct,productValue,productDescription`;
          categoryFilterActive = true;
        } else {
          url = `https://${API}/products?`;
        }
        if (minPrice) {
          url += `&minPrice=${minPrice}`;
        }
        if (maxPrice) {
          url += `&maxPrice=${maxPrice}`;
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`; // Usa searchQuery (da URL)
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        let productListData = [];

        if (subcategoryFilterActive) {
          productListData = data.products || [];
        } else if (categoryFilterActive) {
          productListData = data.products || [];
        } else {
          productListData = data;
        }

        if (productListData.length === 0) {
          setProductsFound(false);
        } else {
          setProductsFound(true);
          setProducts(productListData);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos', error);
        setProductsFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // Agora depende APENAS de searchParams

  // Removemos o useEffect que sincronizava filters.search e searchParams

  return (
    <Box>
      {/* Hero Section com Slider */}
      <HeroSlider />

      {/* Botão de Filtro Mobile - REPOSICIONADO */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleOpenMobileFilter}
          sx={{ textTransform: 'none' }}
        >
          Filtrar Produtos
        </Button>
      </Box>

      {/* Catálogo de Produtos */}
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: '250px' }}>
          <Sidebar
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </Box>

        {/* Modal/Drawer Mobile para Filtros */}
        <Drawer
          open={isMobileFilterOpen}
          onClose={handleCloseMobileFilter}
          anchor="left"
          PaperProps={{
            sx: { width: '80%', maxWidth: '300px', p: 2 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Filtrar Produtos</Typography>
            <IconButton onClick={handleCloseMobileFilter}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Sidebar
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </Drawer>

        <Grid container spacing={4} sx={{ p: 6 }} justifyContent="flex-start">
          {/* WRAP THE PRODUCT LIST IN A SUSPENSE BOUNDARY */}
          <React.Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '50vh',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '50vh',
                }}
              >
                <CircularProgress />
              </Box>
            ) : !productsFound ? (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  Nenhum produto encontrado com os filtros selecionados.
                </Typography>
              </Grid>
            ) : (
              products.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={product.id}
                  sx={{ maxWidth: '350px', width: '100%' }}
                >
                  <ProductCard
                    pai={'grid'}
                    product={{
                      ...product,
                      name: product.nameProduct,
                      price: product.productValue,
                      image: '/600x400.svg', // Imagem placeholder
                    }}
                  />
                </Grid>
              ))
            )}
          </React.Suspense>
        </Grid>
      </Box>
    </Box>
  );
}

export default Catalogo;