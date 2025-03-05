'use client'

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  FormLabel,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { API } from '../configs/general'; // Importe a constante API

function Sidebar({ onFilterChange, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters || {
    rating: 'Tudo',
    minPrice: '',
    maxPrice: '',
    discount: 'Tudo',
    category: 'Tudo',
    subcategory: 'Tudo' // Adicionando filtro de subcategoria
  });
  const [categories, setCategories] = useState([]); // Estado para categorias
  const [subcategories, setSubcategories] = useState([]); // Estado para subcategorias

  useEffect(() => {
    setFilters(initialFilters || {
      rating: 'Tudo',
      minPrice: '',
      maxPrice: '',
      discount: 'Tudo',
      category: 'Tudo',
      subcategory: 'Tudo'
    });
  }, [initialFilters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://${API}/categories`);
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        const data = await response.json();
        setCategories([{ id: 'Tudo', name: 'Todas as Categorias' }, ...data]);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setCategories([{ id: 'Tudo', name: 'Todas as Categorias' }]);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await fetch(`https://${API}/subcategories`);
        if (!response.ok) {
          throw new Error('Erro ao buscar subcategorias');
        }
        const data = await response.json();
        setSubcategories([{ id: 'Tudo', name: 'Todas as Subcategorias' }, ...data]); // Adiciona "Todas as Subcategorias"
      } catch (error) {
        console.error("Erro ao buscar subcategorias:", error);
        setSubcategories([{ id: 'Tudo', name: 'Todas as Subcategorias' }]); // Garante "Todas as Subcategorias" mesmo em erro
      }
    };

    fetchCategories();
    fetchSubcategories(); // Busca subcategorias também
  }, []);


  const handleInputChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleRadioChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleCategoryChange = (event) => {
    setFilters({ ...filters, category: event.target.value, subcategory: 'Tudo' }); // Reseta subcategoria ao mudar categoria
  };

  const handleSubcategoryChange = (event) => {
    setFilters({ ...filters, subcategory: event.target.value });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <Box
      sx={{
        width: 250,
        minWidth: 250,
        padding: 2,
        height: "100%",
        borderRight: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
       <Button
        variant="contained"
        color="primary"
        onClick={handleApplyFilters}
        sx={{ mb: '10px', textTransform: 'none' }}
      >
        Aplicar Filtros
      </Button>
      {/* Categorias */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Categorias
      </Typography>
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <RadioGroup
          aria-label="categorias"
          name="category"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              value={category.id}
              control={<Radio />}
              label={category.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Subcategorias */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Subcategorias
      </Typography>
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <RadioGroup
          aria-label="subcategorias"
          name="subcategory"
          value={filters.subcategory}
          onChange={handleSubcategoryChange}
        >
          {subcategories.map((subcategory) => (
            <FormControlLabel
              key={subcategory.id}
              value={subcategory.id}
              control={<Radio />}
              label={subcategory.name}
            />
          ))}
        </RadioGroup>
      </FormControl>


      {/* Preço */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Preço
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
        {/* Campo para Preço Mínimo */}
        <TextField
          label="Preço Mínimo"
          variant="outlined"
          type="number"
          size="small"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleInputChange}
        />

        {/* Traço entre os campos */}
        <Typography variant="body1">-</Typography>

        {/* Campo para Preço Máximo */}
        <TextField
          label="Preço Máximo"
          variant="outlined"
          type="number"
          size="small"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
      </Box>

      {/* Desconto */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Desconto
      </Typography>
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <RadioGroup name="discount" value={filters.discount} onChange={handleRadioChange}>
          <FormControlLabel value="Tudo" control={<Radio />} label="Tudo" />
          {[10, 20, 30, 50].map((discount) => (
            <FormControlLabel
              key={discount}
              value={discount.toString()}
              control={<Radio />}
              label={`${discount}% ou mais`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default Sidebar;