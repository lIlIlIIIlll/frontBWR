// src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress, // Import CircularProgress for loading indicator
  Autocomplete, // <-- Import Autocomplete
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePathname, useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { API } from '../configs/general.js';
import { ChromePicker } from 'react-color'; // Import the ChromePicker

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selectedPage, setSelectedPage] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for general actions
  const [isSaving, setIsSaving] = useState(false); // Loading state specifically for save operations
  const [allProductsForSelection, setAllProductsForSelection] = useState([]); // <-- ADDED: State for all products (for related selection)
  const [loadingAllProducts, setLoadingAllProducts] = useState(false); // <-- ADDED: Loading state for all products list

  // Estados e funções para Posts
  const [postsList, setPostsList] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalMode, setPostModalMode] = useState('add');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostRowIds, setSelectedPostRowIds] = useState([]);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    media: [],
  });
  // Unified form data state
  const [formData, setFormData] = useState({
    nameProduct: '',
    productModel: '',
    description: '',
    additionalInfo: '',
    price: '',
    stockQuantity: 0,
    categoryId: '',
    subcategoryId: '',
    productFrete: false,
    relatedProductIds: [], // <-- ADDED: Initialize relatedProductIds
    technicalDetails: {
        flow: '',
        pressure: '',
        rotation: '',
        power: '',
        temperature: '',
        weight: '',
        oilCapacity: '',
        inlet: '',
        outlet: '',
    },
  });

  // Hero Section States and Functions
  const [heroSections, setHeroSections] = useState([]);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroModalMode, setHeroModalMode] = useState('add');
  const [selectedHeroSection, setSelectedHeroSection] = useState(null);
  const [selectedHeroRowIds, setSelectedHeroRowIds] = useState([]);
  const [isDeleteHeroModalOpen, setIsDeleteHeroModalOpen] = useState(false);
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    colorText: '#ffffff', // Initial color (white)
  });
  const [displayColorPicker, setDisplayColorPicker] = useState(false); // Control color picker visibility

  // Category and Subcategory States and Functions
  const [categoriesList, setCategoriesList] = useState([]);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryRowIds, setSelectedCategoryRowIds] = useState([]);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
  });
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [subcategoryModalMode, setSubcategoryModalMode] = useState('add');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubcategoryRowIds, setSelectedSubcategoryRowIds] = useState([]);
  const [isDeleteSubcategoryModalOpen, setIsDeleteSubcategoryModalOpen] = useState(false);
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    categoryId: '',
  });

  // State to trigger category and subcategory list refresh
  const [categoryChange, setCategoryChange] = useState(0);
  const [subcategoryChange, setSubcategoryChange] = useState(0);


  const handleClickColor = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleCloseColor = () => {
    setDisplayColorPicker(false);
  };


    const handleColorChange = (color) => {
    setHeroFormData({ ...heroFormData, colorText: color.hex });
  };

  const handleHeroInputChange = (e) => {
    setHeroFormData({ ...heroFormData, [e.target.name]: e.target.value });
  };

  const handleOpenHeroModal = (mode, heroSection = null) => {
    setHeroModalMode(mode);
    if (heroSection) {
      setSelectedHeroSection(heroSection);
      setHeroFormData({
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        imageUrl: heroSection.imageUrl,
        buttonText: heroSection.buttonText,
        buttonLink: heroSection.buttonLink,
        colorText: heroSection.colorText || '#ffffff', // Ensure colorText exists
      });
    } else {
      setHeroFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonText: '',
        buttonLink: '',
        colorText: '#ffffff', // Default to white
      });
    }
    setIsHeroModalOpen(true);
  };

  const handleCloseHeroModal = () => {
    setIsHeroModalOpen(false);
    setSelectedHeroSection(null);
    setHeroFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      colorText: '#ffffff', // Reset to default
    });
    setDisplayColorPicker(false); // Close color picker on modal close
  };

  const handleSaveHeroSection = async () => {
    setIsSaving(true); // Start saving indicator
    const token = sessionStorage.getItem('token');
    const isEditMode = heroModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/herosection/${selectedHeroSection.id}`
      : `https://${API}/herosection`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroFormData),
      });

      if (response.ok) {
        const savedHeroSection = await response.json();
        if (isEditMode) {
          setHeroSections(
            heroSections.map((hs) =>
              hs.id === savedHeroSection.id ? savedHeroSection : hs
            )
          );
          alert('Hero Section atualizada com sucesso!');
        } else {
          setHeroSections([...heroSections, savedHeroSection]);
          alert('Hero Section adicionada com sucesso!');
        }
        handleCloseHeroModal();
        fetchHeroSections(); // Refresh list
      } else {
        const errorData = await response.json();
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} Hero Section: ${
            errorData.message || 'Erro desconhecido'
          }`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} Hero Section:`,
        error
      );
      alert(
        `Erro ao ${
          isEditMode ? 'atualizar' : 'adicionar'
        } Hero Section. Tente novamente.`
      );
    } finally {
      setIsSaving(false); // Stop saving indicator
    }
  };

  const handleDeleteSelectedHeroSections = async () => {
    setIsLoading(true); // Use general loading for delete actions
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      setIsLoading(false);
      return;
    }

    try {
      const deletePromises = selectedHeroRowIds.map((id) =>
        fetch(`https://${API}/herosection/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (successfulDeletes.length > 0) {
        // Update state locally first for faster UI feedback
        setHeroSections(
          heroSections.filter((hs) => !selectedHeroRowIds.includes(hs.id))
        );
        setSelectedHeroRowIds([]);
        alert(`${successfulDeletes.length} Hero Sections excluídas com sucesso.`);
        // No need to fetch again immediately if local update is sufficient
      } else {
        // Check for specific errors if needed
        results.forEach(result => {
            if (result.status === 'rejected') {
                console.error("Failed to delete hero section:", result.reason);
            } else if (!result.value.ok) {
                console.error("Failed to delete hero section, status:", result.value.status);
            }
        });
        alert('Nenhuma Hero Section foi excluída ou ocorreu um erro.');
      }
    } catch (error) {
      console.error('Erro ao excluir Hero Sections:', error);
      alert('Erro ao excluir Hero Sections.');
    } finally {
      setIsLoading(false);
      setIsDeleteHeroModalOpen(false);
      // fetchHeroSections(); // Consider if fetching is always needed after delete attempt
    }
  };

  const handleOpenDeleteHeroModal = () => {
    if (selectedHeroRowIds.length > 0) {
      setIsDeleteHeroModalOpen(true);
    } else {
      alert('Selecione pelo menos uma Hero Section para excluir.');
    }
  };

  const handleCloseDeleteHeroModal = () => {
    setIsDeleteHeroModalOpen(false);
  };

  const fetchHeroSections = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoading(true); // Indicate loading when fetching
      try {
        const response = await fetch(`https://${API}/herosection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHeroSections(data);
        } else {
          console.error('Falha ao buscar Hero Sections:', response.statusText);
          // Optionally: show user feedback about fetch failure
        }
      } catch (error) {
        console.error('Erro ao buscar Hero Sections:', error);
        // Optionally: show user feedback about fetch failure
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    }
  };

 const heroSectionColumns = [
    { field: 'id', headerName: 'ID', width: 90 }, // Increased width slightly
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'subtitle', headerName: 'Subtítulo', width: 250 },
    { field: 'imageUrl', headerName: 'URL da Imagem', width: 200 },
    { field: 'buttonText', headerName: 'Texto do Botão', width: 150 },
    { field: 'buttonLink', headerName: 'Link do Botão', width: 200 },
    {
      field: 'colorText',
      headerName: 'Cor do Texto',
      width: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: params.value || '#ffffff', // Default to white if missing
              borderRadius: '50%',
              border: '1px solid #ccc', // Use a lighter border
              marginRight: '8px',
            }}
          />
          {params.value || '#ffffff'}
        </Box>
      ),
    },
    { // Action column for editing directly from the grid (optional but good UX)
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleOpenHeroModal('edit', params.row)}
          size="small"
          aria-label="editar hero section"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
];


  const renderHeroSectionForm = () => (
   <Modal
      open={isHeroModalOpen}
      onClose={handleCloseHeroModal}
      aria-labelledby="hero-modal-title"
      aria-describedby="hero-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '60%',
          bgcolor: 'background.paper',
          border: '1px solid #ccc', // Softer border
          borderRadius: '8px', // Rounded corners
          boxShadow: 24,
          p: isMobile ? 2 : 4, // Adjust padding for mobile
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <IconButton
          aria-label="fechar modal"
          onClick={handleCloseHeroModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="hero-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {heroModalMode === 'add'
            ? 'Adicionar Nova Hero Section'
            : 'Editar Hero Section'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="dense" // Use dense margin
              fullWidth
              required
              label="Título"
              name="title"
              value={heroFormData.title}
              onChange={handleHeroInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              label="Subtítulo"
              name="subtitle"
              value={heroFormData.subtitle}
              onChange={handleHeroInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              required
              label="URL da Imagem de Fundo"
              name="imageUrl"
              value={heroFormData.imageUrl}
              onChange={handleHeroInputChange}
              type="url" // Input type url for better validation/mobile keyboard
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              fullWidth
              label="Texto do Botão (CTA)"
              name="buttonText"
              value={heroFormData.buttonText}
              onChange={handleHeroInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              fullWidth
              label="Link do Botão (CTA)"
              name="buttonLink"
              value={heroFormData.buttonLink}
              onChange={handleHeroInputChange}
              type="url"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClickColor}
                sx={{ textTransform: 'none' }}
              >
                {displayColorPicker ? 'Fechar Seletor' : 'Escolher Cor do Texto'}
              </Button>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: heroFormData.colorText,
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
               />
               <span>{heroFormData.colorText}</span>
              {displayColorPicker && (
                <Box sx={{ position: 'absolute', zIndex: 2, top: '100%', left: 0, mt: 1 }}>
                  {/* <Box
                    sx={{
                      position: 'fixed', // Use fixed to cover entire screen behind picker
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                    onClick={handleCloseColor} // Close when clicking outside
                  /> */}
                   <ChromePicker
                    color={heroFormData.colorText}
                    onChange={handleColorChange}
                    disableAlpha // Assuming alpha is not needed
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button onClick={handleCloseHeroModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveHeroSection}
              disabled={isSaving} // Disable button while saving
            >
              {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );

  // Componente do formulário de produto (Modal)
  const renderProductForm = () => {
      // Filter out the product being edited from the list of selectable related products
      const relatedProductOptions = allProductsForSelection.filter(
        (p) => modalMode === 'add' || p.id !== selectedProduct?.id
      );

      // Map the selected IDs back to product objects for the Autocomplete value
      const selectedRelatedProductObjects = formData.relatedProductIds
        .map(id => allProductsForSelection.find(p => p.id === id))
        .filter(p => p !== undefined); // Filter out undefined if an ID doesn't match (shouldn't happen ideally)

    return (
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '95%' : '70%', // Slightly wider
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: 24,
            p: isMobile ? 2 : 4,
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
          <IconButton
            aria-label="fechar modal"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {modalMode === 'add' ? 'Adicionar Novo Produto' : 'Editar Produto'}
          </Typography>

          <Grid container spacing={2}>
             <Grid item xs={12} sm={6}>
               <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Nome do Produto"
                  name="nameProduct"
                  value={formData.nameProduct || ''}
                  onChange={handleInputChange}
               />
             </Grid>
             <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Modelo do Produto"
                  name="productModel"
                  value={formData.productModel || ''}
                  onChange={handleInputChange}
                />
             </Grid>
             <Grid item xs={12}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Descrição do Produto"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
             </Grid>
              <Grid item xs={12}>
                 <TextField
                  margin="dense"
                  fullWidth
                  label="Informações Adicionais"
                  name="additionalInfo"
                  multiline
                  rows={2}
                  value={formData.additionalInfo || ''}
                  onChange={handleInputChange}
                 />
             </Grid>
             <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Preço em R$"
                  name="price"
                  type="number"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }} // Basic validation
                  value={formData.price || ''}
                  onChange={handleInputChange}
                />
             </Grid>
             <Grid item xs={12} sm={4}>
                 <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Quantidade em Estoque"
                  name="stockQuantity"
                  type="number"
                  InputProps={{ inputProps: { min: 0, step: 1 } }} // Basic validation
                  value={formData.stockQuantity || 0}
                  onChange={handleInputChange}
                 />
             </Grid>
              <Grid item xs={12} sm={4}>
                  {/* --- FRETAGE MANUAL CHECKBOX --- */}
                  <FormControlLabel
                      control={
                          <Checkbox
                          checked={formData.productFrete || false}
                          onChange={handleInputChange} // Reuse handleInputChange
                          name="productFrete"
                          color="primary"
                          />
                      }
                      label="Fretagem Manual"
                      sx={{ mt: 1 }} // Add some top margin for alignment
                  />
                  {/* --- END FRETAGE MANUAL CHECKBOX --- */}
             </Grid>

             <Grid item xs={12} sm={6}>
                 <FormControl fullWidth margin="dense" required>
                  <InputLabel id="category-select-label">Categoria</InputLabel>
                  <Select
                      labelId="category-select-label"
                      id="category-select"
                      name="categoryId"
                      value={formData.categoryId || ''}
                      label="Categoria"
                      onChange={handleInputChange}
                  >
                      <MenuItem value=""><em>Nenhuma</em></MenuItem>
                      {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                          {category.name}
                      </MenuItem>
                      ))}
                  </Select>
                  </FormControl>
             </Grid>

             <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                  <InputLabel id="subcategory-select-label">Subcategoria</InputLabel>
                  <Select
                      labelId="subcategory-select-label"
                      id="subcategory-select"
                      name="subcategoryId"
                      value={formData.subcategoryId || ''}
                      label="Subcategoria"
                      onChange={handleInputChange}
                      disabled={!formData.categoryId || subcategories.length === 0} // Disable if no category or no subcategories
                  >
                      <MenuItem value=""><em>Nenhuma</em></MenuItem>
                      {subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                      </MenuItem>
                      ))}
                  </Select>
                  </FormControl>
              </Grid>

              {/* --- RELATED PRODUCTS AUTOCOMPLETE --- */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="related-products-autocomplete"
                  options={relatedProductOptions} // Use filtered options
                  getOptionLabel={(option) => `${option.nameProduct} (ID: ${option.id})`} // Display name and ID
                  value={selectedRelatedProductObjects} // Use the mapped objects
                  loading={loadingAllProducts} // Show loading indicator
                  onChange={(event, newValue) => {
                    // Extract only the IDs from the selected product objects
                    const selectedIds = newValue.map(option => option.id);
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      relatedProductIds: selectedIds,
                    }));
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id} // Compare options by ID
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      variant="outlined"
                      label="Produtos Relacionados"
                      placeholder="Buscar produtos..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingAllProducts ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {/* Optional: Add checkbox for better multiple selection UX */}
                      {/* <Checkbox checked={selected} /> */}
                      {`${option.nameProduct} (ID: ${option.id})`}
                    </li>
                   )}
                   noOptionsText={loadingAllProducts ? "Carregando produtos..." : "Nenhum produto encontrado"}
                />
              </Grid>
              {/* --- END RELATED PRODUCTS AUTOCOMPLETE --- */}


             <Grid item xs={12}>
                  <FormControlLabel
                  control={
                      <Checkbox
                      checked={showTechnicalDetails}
                      onChange={(e) => setShowTechnicalDetails(e.target.checked)}
                      name="showTechnicalDetailsCheckbox"
                      color="primary"
                      />
                  }
                  label="Adicionar/Editar Detalhes Técnicos"
                  />
              </Grid>

              {showTechnicalDetails && (
              <Grid item xs={12}>
                  <Box sx={{ mt: 1, mb: 2, border: '1px solid #e0e0e0', padding: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>Detalhes Técnicos</Typography>
                  <Grid container spacing={2}>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Vazão" name="flow" value={formData.technicalDetails?.flow || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Pressão" name="pressure" value={formData.technicalDetails?.pressure || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Rotação" name="rotation" value={formData.technicalDetails?.rotation || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Potência" name="power" value={formData.technicalDetails?.power || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Temperatura" name="temperature" value={formData.technicalDetails?.temperature || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Peso" name="weight" value={formData.technicalDetails?.weight || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Capacidade Óleo" name="oilCapacity" value={formData.technicalDetails?.oilCapacity || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Entrada" name="inlet" value={formData.technicalDetails?.inlet || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                      <Grid item xs={6} sm={4} md={3}><TextField fullWidth margin="dense" label="Saída" name="outlet" value={formData.technicalDetails?.outlet || ''} onChange={handleTechnicalDetailsInputChange} /></Grid>
                  </Grid>
                  </Box>
               </Grid>
              )}

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                 <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
                      Cancelar
                 </Button>
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProduct}
                      disabled={isSaving || loadingAllProducts} // Disable if saving or loading product list
                  >
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar Produto'}
                  </Button>
              </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  }

  const handleSavePost = async () => {
    setIsSaving(true);
    const token = sessionStorage.getItem('token');
    const isEditMode = postModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/posts/${selectedPost.id}`
      : `https://${API}/posts`;
    const method = isEditMode ? 'PUT' : 'POST';

    // Basic validation: Ensure title is present
    if (!postFormData.title?.trim()) {
        alert('O título do post é obrigatório.');
        setIsSaving(false);
        return;
    }

    const postData = {
      title: postFormData.title,
      subtitle: postFormData.subtitle,
      content: postFormData.content,
      imageUrl: postFormData.imageUrl,
      // Only include media if it exists and has data (adjust as needed)
      ...(postFormData.media && postFormData.media.length > 0 && { media: postFormData.media }),
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        fetchPosts(); // Refresh the list
        alert(`Post ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
        handleClosePostModal(); // Close modal on success
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao processar a resposta do servidor.' }));
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} post: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} post:`,
        error
      );
      alert(
        `Erro ao ${
          isEditMode ? 'atualizar' : 'adicionar'
        } post. Verifique sua conexão ou tente novamente.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Função auxiliar para recarregar os produtos da grid principal
  const fetchProducts = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://${API}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const processedData = data.map((product) => ({
            ...product,
            categoryName: product.category?.name ?? 'N/A',
            subcategoryName: product.subcategory?.name ?? 'N/A',
            imagesCount: product.images?.length ?? 0,
            hasTechnicalDetails: !!product.technicalDetails,
            productValue: product.productValue || 0,
            stockQuantity: Number(product.stockQuantity) || 0,
          }));
          setProducts(processedData);
        } else {
          console.error('Falha ao buscar produtos:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
          setIsLoading(false);
      }
    }
  };

   // <-- ADDED: Function to fetch all products for the selection dropdown -->
   const fetchAllProductsForSelection = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setLoadingAllProducts(true); // Start loading indicator for dropdown
      try {
        const response = await fetch(`https://${API}/products?fields=id,nameProduct`, { // Fetch only needed fields
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Ensure data has id and nameProduct, provide fallback if necessary
          const formattedData = data.map(p => ({
              id: p.id,
              nameProduct: p.nameProduct || `Produto ID ${p.id}` // Fallback name
          }));
          setAllProductsForSelection(formattedData);
        } else {
          console.error('Falha ao buscar todos os produtos para seleção:', response.statusText);
          setAllProductsForSelection([]); // Reset on failure
        }
      } catch (error) {
        console.error('Erro ao buscar todos os produtos para seleção:', error);
        setAllProductsForSelection([]); // Reset on error
      } finally {
        setLoadingAllProducts(false); // Stop loading indicator for dropdown
      }
    }
  };
  // <-- END ADDED FUNCTION -->


  // Função auxiliar para recarregar os posts
  const fetchPosts = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://${API}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Format dates if needed for display
           const formattedData = data.map(post => ({
                ...post,
                createdAt: post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR') : 'N/A',
                updatedAt: post.updatedAt ? new Date(post.updatedAt).toLocaleString('pt-BR') : 'N/A',
            }));
          setPostsList(formattedData);
        } else {
          console.error('Falha ao buscar posts:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
          setIsLoading(false);
      }
    }
  };

  // Função auxiliar para recarregar as categorias (para dropdowns)
  const fetchCategories = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        // No loading indicator needed here if it's just for dropdowns
      try {
        const response = await fetch(`https://${API}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Used in product form dropdown
        } else {
          console.error('Falha ao buscar categorias (dropdown):', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias (dropdown):', error);
      }
    }
  };

  // Função auxiliar para recarregar a LISTA de categorias (para DataGrid)
  const fetchCategoriesList = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
       setIsLoading(true); // Loading for the main grid view
      try {
        const response = await fetch(`https://${API}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategoriesList(data); // Used in category management grid
        } else {
          console.error('Falha ao buscar lista de categorias:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar lista de categorias:', error);
      } finally {
          setIsLoading(false);
      }
    }
  };


  // Função auxiliar para recarregar a LISTA de subcategorias (para DataGrid)
  const fetchSubcategoriesList = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
       setIsLoading(true); // Loading for the main grid view
      try {
        const response = await fetch(`https://${API}/subcategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Optionally map category names if needed in the grid
           const populatedSubcategories = await Promise.all(data.map(async (sub) => {
             let categoryName = 'N/A';
             if (sub.categoryId) {
                 // Fetch category name - consider caching or fetching all categories once
                 // For simplicity here, we fetch individually or rely on the existing 'categories' state
                 const parentCategory = categories.find(cat => cat.id === sub.categoryId) || categoriesList.find(cat => cat.id === sub.categoryId);
                 categoryName = parentCategory ? parentCategory.name : 'ID: ' + sub.categoryId;
             }
             return { ...sub, categoryName };
          }));
          setSubcategoriesList(populatedSubcategories); // Used in subcategory management grid
        } else {
          console.error('Falha ao buscar lista de subcategorias:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar lista de subcategorias:', error);
      } finally {
          setIsLoading(false);
      }
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/registro'); // Redirect to login/register if no token
      } else {
          // Fetch data needed regardless of the initial page (for forms etc.)
          fetchCategories();
          fetchAllProductsForSelection(); // <-- ADDED: Fetch all products for selection

          // Fetch data for the initially selected page
          switch(selectedPage) {
              case 'products':
                  fetchProducts();
                  break;
              case 'posts':
                  fetchPosts();
                  break;
              case 'hero':
                  fetchHeroSections();
                  break;
              case 'categories':
                  fetchCategoriesList();
                  break;
              case 'subcategories':
                  fetchSubcategoriesList();
                  break;
              default:
                  fetchProducts(); // Default case
          }
      }
    };

    checkToken();
    // Dependencies: router, selectedPage. Fetching logic depends on the selected tab.
  }, [router, selectedPage]); // Re-fetch when selectedPage changes


  // Fetch subcategories for the product form when categoryId changes
  useEffect(() => {
    const fetchSubcategoriesForDropdown = async (categoryId) => {
      const token = sessionStorage.getItem('token');
      if (token && categoryId) {
          // No separate loading indicator for this, happens within the modal
        try {
          // Assuming endpoint to get subcategories by category ID exists
          const response = await fetch(
            `https://${API}/subcategories/categories/${categoryId}`, // Adjusted endpoint
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSubcategories(data); // State for the product form dropdown
          } else {
            console.error(
              'Falha ao buscar subcategorias (dropdown):',
              response.statusText
            );
            setSubcategories([]); // Clear if fetch fails
          }
        } catch (error) {
          console.error('Erro ao buscar subcategorias (dropdown):', error);
          setSubcategories([]); // Clear on error
        }
      } else {
         setSubcategories([]); // Clear if no category is selected
      }
    };

    if (formData.categoryId) {
      fetchSubcategoriesForDropdown(formData.categoryId);
    } else {
      setSubcategories([]); // Reset if category is cleared
       // Also clear subcategory selection in formData if category changes
       // setFormData(prev => ({ ...prev, subcategoryId: '' })); // Optional: uncomment if desired
    }
    // Dependency: formData.categoryId triggers this effect.
  }, [formData.categoryId]);


  // Funções para CRUD de Produtos
  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setShowTechnicalDetails(false);
    setSelectedFile(null); // Reset file input if you have one
    setFormData({ // Reset form data to defaults
      nameProduct: '',
      productModel: '',
      description: '',
      additionalInfo: '',
      price: '',
      stockQuantity: 0,
      categoryId: '',
      subcategoryId: '',
      productFrete: false,
      relatedProductIds: [], // <-- ADDED: Reset relatedProductIds
      technicalDetails: {
        flow: '', pressure: '', rotation: '', power: '',
        temperature: '', weight: '', oilCapacity: '',
        inlet: '', outlet: '',
      },
    });
    setSubcategories([]); // Clear subcategories dropdown for new product
    setIsModalOpen(true);
  };

  const handleEditProduct = () => {
    if (selectedRowIds.length === 1) {
      // Find the product from the MAIN product list (state `products`)
      const productToEdit = products.find(
        (product) => product.id === selectedRowIds[0]
      );
      if (productToEdit) {
        setModalMode('edit');
        setSelectedProduct(productToEdit); // Keep track of the product being edited
        const hasDetails = !!productToEdit.technicalDetails;
        setShowTechnicalDetails(hasDetails);

        // --- FIX: Parse the relatedProductIds string into an array of numbers ---
        let relatedIds = []; // Default to empty array
        const rawRelatedIds = productToEdit.relatedProductIds; // Get the raw string/null value

        if (typeof rawRelatedIds === 'string' && rawRelatedIds.trim() !== '') {
          relatedIds = rawRelatedIds
            .split(',')             // Split the string "11,13,14" into ["11", "13", "14"]
            .map(idStr => parseInt(idStr.trim(), 10)) // Convert each string ID to a number
            .filter(id => !isNaN(id)); // Filter out any potential NaN results (e.g., from empty strings or bad data)
        }
        // Now `relatedIds` is an array of numbers, e.g., [11, 13, 14] or []
        // --- END FIX ---

        setFormData({
          nameProduct: productToEdit.nameProduct || '',
          price: productToEdit.productValue || '', // Use productValue here
          description: productToEdit.productDescription || '', // Use productDescription
          categoryId: productToEdit.categoryId || '',
          subcategoryId: productToEdit.subcategoryId || '',
          productFrete: productToEdit.productFrete || false,
          relatedProductIds: relatedIds, // <-- USE THE CORRECTLY PARSED ARRAY OF IDs
          technicalDetails: productToEdit.technicalDetails || { // Default empty details if null
            flow: '', pressure: '', rotation: '', power: '',
            temperature: '', weight: '', oilCapacity: '',
            inlet: '', outlet: '',
          },
          productModel: productToEdit.productModel || '',
          additionalInfo: productToEdit.additionalInfo || '',
          stockQuantity: productToEdit.stockQuantity || 0,
        });
        // Note: The useEffect listening to formData.categoryId will fetch subcategories automatically
        setIsModalOpen(true);
      } else {
         alert("Produto selecionado não encontrado na lista. Tente recarregar.");
      }
    } else {
      alert('Por favor, selecione exatamente um produto para editar.');
    }
  };

  // Função de exclusão de PRODUTOS
  const handleDeleteSelectedProductsAction = async () => {
    setIsLoading(true); // Use general loading for delete
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      setIsLoading(false);
      return;
    }

    try {
      const deletePromises = selectedRowIds.map((id) =>
        fetch(`https://${API}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (successfulDeletes.length > 0) {
        // Update state locally for faster feedback
        setProducts(
          products.filter((product) => !selectedRowIds.includes(product.id))
        );
        setSelectedRowIds([]); // Clear selection
        alert(`${successfulDeletes.length} produto(s) excluído(s) com sucesso.`);
      } else {
         results.forEach(result => {
            if (result.status === 'rejected') {
                console.error("Failed to delete product:", result.reason);
            } else if (!result.value.ok) {
                console.error("Failed to delete product, status:", result.value.status);
                // Potentially parse error message from result.value.json() if available
            }
        });
        alert('Nenhum produto foi excluído ou ocorreu um erro durante a exclusão.');
      }
    } catch (error) {
      console.error('Erro geral ao excluir produtos:', error);
      alert('Erro ao tentar excluir produtos.');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      // fetchProducts(); // Re-fetch can be optional if local update is reliable
    }
  };


  const handleOpenDeleteModal = () => {
    if (selectedRowIds.length > 0) {
      setIsDeleteModalOpen(true);
    } else {
      alert('Selecione pelo menos um produto para excluir.');
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Handle file upload logic here if needed - currently not integrated with save
    setSelectedFile(file);
    console.log('Arquivo selecionado:', file);
  };


const handleSaveProduct = async () => {
  setIsSaving(true); // Start saving indicator
  const token = sessionStorage.getItem('token');
  const isEditMode = modalMode === 'edit';
  const url = isEditMode
      ? `https://${API}/products/${selectedProduct.id}`
      : `https://${API}/products`;
  const method = isEditMode ? 'PUT' : 'POST';

  // Validate required fields
  if (!formData.nameProduct?.trim() || !formData.categoryId || formData.price === '' || formData.stockQuantity === '') {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Categoria, Preço e Quantidade.');
      setIsSaving(false);
      return;
  }

  const price = parseFloat(formData.price);
  const stockQuantity = parseInt(formData.stockQuantity, 10);

  // Further validate numeric fields
  if (isNaN(price) || price < 0 || isNaN(stockQuantity) || stockQuantity < 0) {
      alert('Por favor, insira valores numéricos válidos e não negativos para preço e quantidade.');
      setIsSaving(false);
      return;
  }

  // --- FIX: Convert the relatedProductIds array back to a comma-separated string for the API ---
  const relatedIdsString = formData.relatedProductIds.join(',');
  // --- END FIX ---

  const productData = {
      nameProduct: formData.nameProduct,
      description: formData.description, // Keep original field name if backend expects it
      price: price, // Send the parsed float
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId || null, // Send null if not selected
      productValue: price, // Assuming productValue should match price
      productModel: formData.productModel,
      productDescription: formData.description, // Assuming productDescription should match description
      additionalInfo: formData.additionalInfo,
      stockQuantity: stockQuantity, // Send the parsed integer
      productFrete: formData.productFrete,
      relatedProductIds: relatedIdsString, // <-- Send the comma-separated STRING
      // technicalDetails are handled separately after product save/update
  };

   let savedOrUpdatedProduct; // To store the product ID

  try {
       // --- 1. Save/Update Product ---
      const productResponse = await fetch(url, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
      });

      if (!productResponse.ok) {
          const errorData = await productResponse.json().catch(() => ({ message: 'Erro desconhecido ao salvar produto.' }));
          throw new Error(`Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} produto: ${errorData.message || productResponse.statusText}`);
      }

      savedOrUpdatedProduct = await productResponse.json();
      const productId = savedOrUpdatedProduct.id;
      

      // --- 2. Save/Update Technical Details (if checkbox is checked) ---
       if (showTechnicalDetails) {
          const techDetailsExist = isEditMode && selectedProduct && selectedProduct.technicalDetails;
          try {
               await saveTechnicalDetails(productId, formData.technicalDetails, token, techDetailsExist);
          } catch (techDetailsError) {
              console.error('Erro ao salvar detalhes técnicos:', techDetailsError);
              // Alert the user but consider the product saved/updated
              alert(`Produto ${isEditMode ? 'atualizado' : 'criado'} com sucesso, mas houve um erro ao salvar os detalhes técnicos: ${techDetailsError.message}. Verifique os detalhes técnicos separadamente.`);
              // Proceed to close modal and refresh list even if tech details failed
          }
      } else if (isEditMode && selectedProduct && selectedProduct.technicalDetails) {
          // --- 3. Delete Technical Details (if checkbox is unchecked in edit mode and details existed) ---
          try {
              await deleteTechnicalDetails(selectedProduct.technicalDetails.id, token);
              console.log("Technical details deleted for product:", productId);
          } catch (deleteError) {
              console.error('Erro ao deletar detalhes técnicos:', deleteError);
              alert(`Produto atualizado com sucesso, mas houve um erro ao remover os detalhes técnicos antigos: ${deleteError.message}.`);
          }
      }


      // --- 4. Success Feedback and Cleanup ---
      alert(`Produto ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
      setIsModalOpen(false);
      fetchProducts(); // Refresh the product list
      fetchAllProductsForSelection(); // Refresh the list used for related products dropdown

  } catch (error) {
      console.error(
          `Erro durante o processo de ${isEditMode ? 'atualização' : 'adição'} do produto:`,
          error
      );
      alert(error.message || `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto. Tente novamente.`);
  } finally {
      setIsSaving(false); // Stop saving indicator
  }
};

// Function to save or update technical details
const saveTechnicalDetails = async (productId, details, token, hasExistingDetails) => {
  // Se não houver detalhes para salvar, retorna
  if (!details || Object.keys(details).length === 0 || !Object.values(details).some(v => v)) {
      console.log("Nenhum detalhe técnico para salvar.");
      return;
  }

  // Determina o método e a URL baseado se já existem detalhes
  const method = hasExistingDetails ? 'PUT' : 'POST';
  // Ajuste a URL conforme sua API (pode incluir o productId ou não)
  // Exemplo 1: Endpoint geral para detalhes, productId vai no corpo
  let url = `https://${API}/technical-details`;
  // Exemplo 2: Endpoint específico para o produto
  // let url = `https://${API}/products/${productId}/technical-details`;
  // Exemplo 3: Se for PUT, pode precisar do ID do detalhe técnico
  // let url = `https://${API}/technical-details/${existingDetailId}`; // Necessitaria buscar o ID antes

  // Prepara o corpo da requisição
  const body = {
      ...details,
      productId: productId, // Garante que o productId está no corpo, se necessário
  };
  // Remover campos vazios se a API não os aceitar
   Object.keys(body).forEach(key => (body[key] == null || body[key] === '') && delete body[key]);


  try {
      const response = await fetch(url, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errorData.message || `Falha ao salvar detalhes técnicos (${response.status})`);
      }

      console.log("Detalhes técnicos salvos com sucesso.");
      // return await response.json(); // Retorna os dados salvos se necessário

  } catch (error) {
      console.error('Erro na função saveTechnicalDetails:', error);
      throw error; // Re-lança o erro para ser tratado no handleSaveProduct
  }
};


// Function to delete technical details
const deleteTechnicalDetails = async (productId, token) => {
    // IMPORTANT: Verify your actual API endpoint for deleting Tech Details by Product ID
    const url = `https://${API}/technical-details/`;
    console.log("Attempting to delete technical details for product:", productId);

    const bodyy = {
      id:selectedProduct.technicalDetails.id, // Garante que o productId está no corpo, se necessário
  };

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyy)
        });

        // Check for 200 OK or 204 No Content which are typical success statuses for DELETE
        if (!response.ok && response.status !== 204) {
             // Try to get error message, default if fails
             const errorData = await response.json().catch(() => ({ message: 'Resposta inválida do servidor.' }));
             // Don't throw if it's a 404 maybe (details didn't exist anyway), depends on API design
             if (response.status === 404) {
                 console.warn("Technical details not found for deletion (status 404).");
                 return; // Treat as non-critical error or success
             }
             throw new Error(errorData.message || `Falha ao deletar detalhes técnicos (status ${response.status})`);
        }

        console.log("Detalhes técnicos deletados com sucesso (ou não encontrados).");

    } catch (error) {
        console.error('Erro ao deletar detalhes técnicos:', error);
        throw error; // Re-throw
    }
};


  // Funções para CRUD de Posts (corrigido e separado)
  const handleAddPost = () => {
    setPostModalMode('add');
    setSelectedPost(null);
    setPostFormData({ // Reset post form
      title: '',
      subtitle: '',
      content: '',
      imageUrl: '',
      media: [], // Reset media array if used
    });
    setIsPostModalOpen(true);
  };

  const handleEditPost = () => {
    if (selectedPostRowIds.length === 1) {
      // Find the post from the list *using the correct ID*
      const postToEdit = postsList.find(post => post.id === selectedPostRowIds[0]);
      if (postToEdit) {
        setPostModalMode('edit');
        setSelectedPost(postToEdit); // Store the selected post object
        setPostFormData({
          title: postToEdit.title || '',
          subtitle: postToEdit.subtitle || '',
          content: postToEdit.content || '',
          imageUrl: postToEdit.imageUrl || '',
          media: postToEdit.media || [], // Load existing media if available
        });
        setIsPostModalOpen(true);
      } else {
         alert("Post selecionado não encontrado na lista. Tente recarregar.");
      }
    } else {
      alert('Por favor, selecione exatamente um post para editar.');
    }
  };

  // Função de exclusão de POSTS
  const handleDeleteSelectedPostsAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      setIsLoading(false);
      return;
    }

    try {
      const deletePromises = selectedPostRowIds.map((id) =>
        fetch(`https://${API}/posts/${id}`, { // Correct endpoint for posts
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (successfulDeletes.length > 0) {
        // Update state locally
        setPostsList(
          postsList.filter((post) => !selectedPostRowIds.includes(post.id))
        );
        setSelectedPostRowIds([]); // Clear selection
        alert(`${successfulDeletes.length} post(s) excluído(s) com sucesso.`);
      } else {
         results.forEach(result => {
            if (result.status === 'rejected') {
                console.error("Failed to delete post:", result.reason);
            } else if (!result.value.ok) {
                console.error("Failed to delete post, status:", result.value.status);
            }
        });
        alert('Nenhum post foi excluído ou ocorreu um erro.');
      }
    } catch (error) {
      console.error('Erro ao excluir posts:', error);
      alert('Erro ao excluir posts.');
    } finally {
      setIsLoading(false);
      setIsDeletePostModalOpen(false);
      // fetchPosts(); // Optional: re-fetch if needed
    }
  };


  const handleOpenDeletePostModal = () => {
    if (selectedPostRowIds.length > 0) {
      setIsDeletePostModalOpen(true);
    } else {
      alert('Selecione pelo menos um post para excluir.');
    }
  };

  const handleCloseDeletePostModal = () => {
    setIsDeletePostModalOpen(false);
  };

  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setPostFormData({ ...postFormData, [name]: value });
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null); // Clear selected post on close
     setPostFormData({ title: '', subtitle: '', content: '', imageUrl: '', media: [] }); // Reset form
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Clear selected product
    // Reset formData
    setFormData({
        nameProduct: '', productModel: '', description: '', additionalInfo: '',
        price: '', stockQuantity: 0, categoryId: '', subcategoryId: '', productFrete: false,
        relatedProductIds: [], // <-- ADDED: Reset related IDs
        technicalDetails: { flow: '', pressure: '', rotation: '', power: '', temperature: '', weight: '', oilCapacity: '', inlet: '', outlet: '' }
    });
    setShowTechnicalDetails(false);
    setSubcategories([]); // Clear subcategories too
  };

  // Unified input change handler for Product form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox specifically
    if (type === 'checkbox') {
        if (name === 'productFrete') { // Check if it's the frete checkbox
             setFormData(prevFormData => ({
                ...prevFormData,
                [name]: checked, // Use checked property for boolean value
             }));
        }
        // Add other checkboxes here if needed
    }
    // Handle numeric fields like price and stockQuantity
    else if (name === 'price') {
        // Allow empty string or valid number format (e.g., 12.34)
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
             setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
             }));
        }
    } else if (name === 'stockQuantity') {
         // Allow empty string or valid integer
        if (value === '' || /^\d*$/.test(value)) {
             setFormData(prevFormData => ({
                ...prevFormData,
                 // Store as string temporarily in form, parse on save
                 // Or parse immediately: [name]: value === '' ? '' : parseInt(value, 10),
                [name]: value,
             }));
        }
    }
    // Handle category change (might trigger subcategory fetch)
    else if (name === 'categoryId') {
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: value,
            subcategoryId: '', // Reset subcategory when category changes
        }));
    }
    // Default handler for other text inputs
    else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Handler specifically for technical details inputs
  const handleTechnicalDetailsInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      technicalDetails: {
        ...prevFormData.technicalDetails,
        [name]: value,
      },
    }));
  };

  // --- DataGrid Columns Definitions ---

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'nameProduct',
      headerName: 'Nome',
      width: 250,
    },
     {
      field: 'productModel',
      headerName: 'Modelo',
      width: 150,
    },
    {
      field: 'productValue',
      headerName: 'Preço',
      type: 'number',
      width: 120,
       valueFormatter: (value) => // Format as currency
        typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    },
     {
      field: 'stockQuantity',
      headerName: 'Estoque',
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    { field: 'categoryName', headerName: 'Categoria', width: 150 },
    { field: 'subcategoryName', headerName: 'Subcategoria', width: 150 },
    // { field: 'imagesCount', headerName: 'Imagens', width: 90, type: 'number', align: 'center', headerAlign: 'center', }, // Hiding for now
    {
      field: 'hasTechnicalDetails',
      headerName: 'Detalhes Téc.',
      width: 120,
      type: 'boolean',
      align: 'center',
      headerAlign: 'center',
    },
     {
      field: 'productFrete', // <-- ADDED: Display productFrete status
      headerName: 'Frete Manual',
      width: 130,
      type: 'boolean',
      align: 'center',
      headerAlign: 'center',
    },
    // --- FIX: Updated Related Products Count Column ---
    {
      field: 'relatedProductIds', // Field still holds the raw string/null from API data
      headerName: 'Relacionados',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      type: 'number', // Treat as number for sorting
      valueGetter: (value) => { // Calculate count *from the string*
          if (typeof value === 'string' && value.trim() !== '') {
              // Split the string, filter out potential empty strings if separators are messy (e.g., ",," or ends with ",")
              return value.split(',').filter(id => id.trim() !== '').length;
          }
          return 0; // Return 0 if null, empty string, or not a string
      },
      renderCell: (params) => ( // Display the count calculated by valueGetter
          <Typography variant="body2">
            {params.value}
          </Typography>
      ),
    },
  ];

  const postColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Título', width: 300 },
    { field: 'subtitle', headerName: 'Subtítulo', width: 300 },
    { field: 'createdAt', headerName: 'Criado em', width: 180 },
    { field: 'updatedAt', headerName: 'Atualizado em', width: 180 },
     { // Action column
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
              e.stopPropagation();
              setSelectedPostRowIds([params.id]);
              handleEditPost();
           }}
          size="small"
           aria-label="editar post"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const categoryColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nome da Categoria', flex: 1, minWidth: 200 }, // Use flex grow
     { // Action column
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
           onClick={(e) => {
              e.stopPropagation();
              setSelectedCategoryRowIds([params.id]);
              handleEditCategory();
           }}
          size="small"
           aria-label="editar categoria"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const subcategoryColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nome da Subcategoria', width: 300 },
    { field: 'categoryName', headerName: 'Categoria Pai', width: 250 }, // Display fetched category name
    { field: 'categoryId', headerName: 'ID Categoria', width: 110 }, // Keep ID if needed
     { // Action column
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
           onClick={(e) => {
              e.stopPropagation();
              setSelectedSubcategoryRowIds([params.id]);
              handleEditSubcategory();
           }}
          size="small"
           aria-label="editar subcategoria"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];


  // --- Category CRUD Functions ---
  const handleAddCategory = () => {
    setCategoryModalMode('add');
    setSelectedCategory(null);
    setCategoryFormData({ name: '' });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = () => {
    if (selectedCategoryRowIds.length === 1) {
      const categoryToEdit = categoriesList.find(cat => cat.id === selectedCategoryRowIds[0]);
      if (categoryToEdit) {
        setCategoryModalMode('edit');
        setSelectedCategory(categoryToEdit);
        setCategoryFormData({ name: categoryToEdit.name });
        setIsCategoryModalOpen(true);
      }
    } else {
      alert('Selecione uma categoria para editar.');
    }
  };

  const handleSaveCategory = async () => {
    setIsSaving(true); // Start loading
    const token = sessionStorage.getItem('token');
    const isEditMode = categoryModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/categories/${selectedCategory.id}`
      : `https://${API}/categories`;
    const method = isEditMode ? 'PUT' : 'POST';

    if (!categoryFormData.name?.trim()) {
        alert("O nome da categoria é obrigatório.");
        setIsSaving(false);
        return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        // const updatedCategory = await response.json(); // ID might be in headers for POST
        alert(`Categoria ${isEditMode ? 'atualizada' : 'adicionada'} com sucesso!`);
        setIsCategoryModalOpen(false);
        setCategoryChange(prev => prev + 1); // Trigger useEffect to refresh categories list and dropdowns
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria. Tente novamente.`
      );
    } finally {
      setIsSaving(false); // End loading
    }
  };

  const handleDeleteSelectedCategoriesAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      setIsLoading(false);
      return;
    }

    // Optional: Add check for subcategories before deleting a category
    // This would require an API call or checking the subcategoriesList state

    try {
      const deletePromises = selectedCategoryRowIds.map((id) =>
        fetch(`https://${API}/categories/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(
        (result) => result.status === 'fulfilled' && (result.value.ok || result.value.status === 204)
      );
      const failedDeletes = results.filter(result => result.status === 'rejected' || !(result.value.ok || result.value.status === 204));


      if (successfulDeletes.length > 0) {
        setCategoriesList(
          categoriesList.filter((cat) => !selectedCategoryRowIds.includes(cat.id))
        );
        setSelectedCategoryRowIds([]);
        alert(`${successfulDeletes.length} categoria(s) excluída(s) com sucesso.`);
         setCategoryChange(prev => prev + 1); // Refresh dropdowns
      }

      if (failedDeletes.length > 0) {
           failedDeletes.forEach(result => {
             if (result.status === 'rejected') console.error("Category delete failed:", result.reason);
             // else console.error("Category delete failed with status:", result.value.status);
             // Potentially check error message from result.value.json() if available and status is not ok/204
           });
           alert(`Falha ao excluir ${failedDeletes.length} categoria(s). Verifique se elas contêm subcategorias.`);
      }


    } catch (error) {
      console.error('Erro ao excluir categorias:', error);
      alert('Erro ao excluir categorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteCategoryModalOpen(false);
      // fetchCategoriesList(); // Re-fetch potentially needed if local update fails
    }
  };

  const handleOpenDeleteCategoryModal = () => {
    if (selectedCategoryRowIds.length > 0) {
      setIsDeleteCategoryModalOpen(true);
    } else {
      alert('Selecione pelo menos uma categoria para excluir.');
    }
  };

  const handleCloseDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
  };

  const handleCategoryInputChange = (e) => {
    setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setCategoryFormData({ name: '' }); // Reset form
  };

  const renderCategoryForm = () => (
    <Modal
      open={isCategoryModalOpen}
      onClose={handleCloseCategoryModal}
      aria-labelledby="category-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '400px', // Fixed width for smaller modal
          bgcolor: 'background.paper',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: 24,
          p: isMobile ? 2 : 3,
        }}
      >
        <IconButton
           aria-label="fechar modal"
          onClick={handleCloseCategoryModal}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="category-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {categoryModalMode === 'add' ? 'Adicionar Categoria' : 'Editar Categoria'}
        </Typography>
        <TextField
          margin="dense"
          fullWidth
          required
          label="Nome da Categoria"
          name="name"
          value={categoryFormData.name}
          onChange={handleCategoryInputChange}
          autoFocus // Focus on the field when modal opens
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button onClick={handleCloseCategoryModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCategory}
            disabled={isSaving}
            >
             {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
            </Button>
        </Box>
      </Box>
    </Modal>
  );

  // --- Subcategory CRUD Functions ---
  const handleAddSubcategory = () => {
    setSubcategoryModalMode('add');
    setSelectedSubcategory(null);
    setSubcategoryFormData({ name: '', categoryId: '' });
    setIsSubcategoryModalOpen(true);
  };

  const handleEditSubcategory = () => {
    if (selectedSubcategoryRowIds.length === 1) {
      const subcategoryToEdit = subcategoriesList.find(sub => sub.id === selectedSubcategoryRowIds[0]);
      if (subcategoryToEdit) {
        setSubcategoryModalMode('edit');
        setSelectedSubcategory(subcategoryToEdit);
        setSubcategoryFormData({ name: subcategoryToEdit.name, categoryId: subcategoryToEdit.categoryId });
        setIsSubcategoryModalOpen(true);
      } else {
         alert("Subcategoria selecionada não encontrada. Tente recarregar.");
      }
    } else {
      alert('Selecione uma subcategoria para editar.');
    }
  };

  const handleSaveSubcategory = async () => {
    setIsSaving(true);
    const token = sessionStorage.getItem('token');
    const isEditMode = subcategoryModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/subcategories/${selectedSubcategory.id}`
      : `https://${API}/subcategories`;
    const method = isEditMode ? 'PUT' : 'POST';

    if (!subcategoryFormData.name?.trim() || !subcategoryFormData.categoryId) {
        alert("O nome da subcategoria e a categoria pai são obrigatórios.");
        setIsSaving(false);
        return;
    }


    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryFormData),
      });

      if (response.ok) {
        // const updatedSubcategory = await response.json();
        alert(`Subcategoria ${isEditMode ? 'atualizada' : 'adicionada'} com sucesso!`);
        setIsSubcategoryModalOpen(false);
        setSubcategoryChange(prev => prev + 1); // Trigger useEffect to refresh subcategories list
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria. Tente novamente.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSelectedSubcategoriesAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
       setIsLoading(false);
      return;
    }

     // Optional: Check if subcategory is linked to products before deleting
     // This would require another API call or checking product data

    try {
      const deletePromises = selectedSubcategoryRowIds.map((id) =>
        fetch(`https://${API}/subcategories/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(
        (result) => result.status === 'fulfilled' && (result.value.ok || result.value.status === 204)
      );
      const failedDeletes = results.filter(result => result.status === 'rejected' || !(result.value.ok || result.value.status === 204));

      if (successfulDeletes.length > 0) {
        setSubcategoriesList(
          subcategoriesList.filter((sub) => !selectedSubcategoryRowIds.includes(sub.id))
        );
        setSelectedSubcategoryRowIds([]);
        alert(`${successfulDeletes.length} subcategoria(s) excluída(s) com sucesso.`);
         setSubcategoryChange(prev => prev + 1); // Refresh list if needed elsewhere
      }

       if (failedDeletes.length > 0) {
           failedDeletes.forEach(result => {
             if (result.status === 'rejected') console.error("Subcategory delete failed:", result.reason);
             // else console.error("Subcategory delete failed with status:", result.value.status);
           });
           alert(`Falha ao excluir ${failedDeletes.length} subcategoria(s). Verifique se elas estão vinculadas a produtos.`);
      }

    } catch (error) {
      console.error('Erro ao excluir subcategorias:', error);
      alert('Erro ao excluir subcategorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteSubcategoryModalOpen(false);
      // fetchSubcategoriesList(); // Optional re-fetch
    }

  };


  const handleOpenDeleteSubcategoryModal = () => {
    if (selectedSubcategoryRowIds.length > 0) {
      setIsDeleteSubcategoryModalOpen(true);
    } else {
      alert('Selecione pelo menos uma subcategoria para excluir.');
    }
  };

  const handleCloseDeleteSubcategoryModal = () => {
    setIsDeleteSubcategoryModalOpen(false);
  };

  const handleSubcategoryInputChange = (e) => {
    setSubcategoryFormData({ ...subcategoryFormData, [e.target.name]: e.target.value });
  };

  const handleCloseSubcategoryModal = () => {
    setIsSubcategoryModalOpen(false);
    setSelectedSubcategory(null);
    setSubcategoryFormData({ name: '', categoryId: '' }); // Reset form
  };

  const renderSubcategoryForm = () => (
    <Modal
      open={isSubcategoryModalOpen}
      onClose={handleCloseSubcategoryModal}
      aria-labelledby="subcategory-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '450px', // Slightly wider for dropdown
          bgcolor: 'background.paper',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: 24,
           p: isMobile ? 2 : 3,
        }}
      >
        <IconButton
           aria-label="fechar modal"
          onClick={handleCloseSubcategoryModal}
           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="subcategory-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {subcategoryModalMode === 'add' ? 'Adicionar Subcategoria' : 'Editar Subcategoria'}
        </Typography>
        <TextField
          margin="dense"
          fullWidth
          required
          label="Nome da Subcategoria"
          name="name"
          value={subcategoryFormData.name}
          onChange={handleSubcategoryInputChange}
           autoFocus
        />
        <FormControl fullWidth margin="dense" required>
          <InputLabel id="subcategory-category-select-label">Categoria Pai</InputLabel>
          <Select
            labelId="subcategory-category-select-label"
            id="subcategory-category-select"
            name="categoryId"
            value={subcategoryFormData.categoryId || ''} // Ensure controlled component
            label="Categoria Pai"
            onChange={handleSubcategoryInputChange}
          >
            <MenuItem value="">
              <em>Selecione...</em>
            </MenuItem>
            {/* Use categoriesList which is guaranteed to be fetched for the category management */}
            {categoriesList.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
             <Button onClick={handleCloseSubcategoryModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSubcategory}
            disabled={isSaving}
            >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
            </Button>
         </Box>
      </Box>
    </Modal>
  );


  // Função para renderizar o formulário de post
  const renderPostForm = () => (
    <Modal
      open={isPostModalOpen}
      onClose={handleClosePostModal}
      aria-labelledby="post-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '60%',
          bgcolor: 'background.paper',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: 24,
          p: isMobile ? 2 : 4,
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <IconButton
           aria-label="fechar modal"
          onClick={handleClosePostModal}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="post-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {postModalMode === 'add' ? 'Adicionar Novo Post' : 'Editar Post'}
        </Typography>
         <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                margin="dense"
                fullWidth
                required
                label="Título do Post"
                name="title"
                value={postFormData.title}
                onChange={handlePostInputChange}
                autoFocus
                />
            </Grid>
             <Grid item xs={12}>
                <TextField
                margin="dense"
                fullWidth
                label="Subtítulo do Post"
                name="subtitle"
                value={postFormData.subtitle}
                onChange={handlePostInputChange}
                />
             </Grid>
            <Grid item xs={12}>
                <TextField
                margin="dense"
                fullWidth
                label="Conteúdo do Post"
                multiline
                rows={8} // Adjust as needed
                name="content"
                value={postFormData.content}
                onChange={handlePostInputChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                margin="dense"
                fullWidth
                label="URL da Imagem de Destaque"
                name="imageUrl"
                value={postFormData.imageUrl}
                onChange={handlePostInputChange}
                type="url"
                />
            </Grid>
            {/* Add fields for media if needed */}

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button onClick={handleClosePostModal} sx={{ mr: 1 }}>
                    Cancelar
                </Button>
                <Button
                variant="contained"
                color="primary"
                onClick={handleSavePost}
                 disabled={isSaving}
                >
                 {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar Post'}
                </Button>
            </Grid>
        </Grid>
      </Box>
    </Modal>
  );

  // useEffect to refresh categories list (for dropdowns and grid) when categoryChange increments
  useEffect(() => {
    fetchCategoriesList(); // Refresh the list used in the Category management grid
    fetchCategories();     // Refresh the list used in dropdowns (Product, Subcategory forms)
  }, [categoryChange]);

  // useEffect to refresh subcategories list (for grid) when subcategoryChange increments
  useEffect(() => {
    fetchSubcategoriesList();
    // Also consider refreshing the subcategory dropdown in the product form if needed,
    // though it usually refreshes based on the selected category.
  }, [subcategoryChange]);


  // --- Helper to Render Delete Confirmation Modals ---
  const renderDeleteConfirmationModal = (
        isOpen,
        handleClose,
        handleConfirm,
        itemCount,
        itemType // e.g., "produto", "post", "categoria", "subcategoria", "Hero Section"
    ) => (
    <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby={`delete-${itemType}-modal-title`}
    >
        <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '85%' : 400,
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: 24,
            p: 3,
        }}
        >
        <Typography id={`delete-${itemType}-modal-title`} variant="h6" component="h2">
            Confirmação de Exclusão
        </Typography>
        <Typography sx={{ mt: 2 }}>
            Deseja realmente excluir {itemCount} {itemType}{itemCount > 1 ? 's' : ''}?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {/* Add specific warnings if needed, e.g., for categories */}
            {itemType === 'categoria' && 'Atenção: Excluir categorias pode afetar produtos e subcategorias associadas.'}
            {itemType === 'subcategoria' && 'Atenção: Excluir subcategorias pode afetar produtos associados.'}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
            Cancelar
            </Button>
            <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            disabled={isLoading} // Disable confirm while delete is in progress
            >
             {isLoading ? <CircularProgress size={24} color="inherit" /> : `Sim, Excluir ${itemType}${itemCount > 1 ? 's' : ''}`}
            </Button>
        </Box>
        </Box>
    </Modal>
 );


  return (
    <Box sx={{ p: isMobile ? 2 : 4, pt: isMobile ? '85px' : '113px', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom component="h1">
        Painel de Administração
      </Typography>

      {/* Navigation Tabs/Buttons */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Grid container spacing={isMobile ? 1 : 2}>
             {/* Map over pages for cleaner code */}
             {[
                { key: 'products', label: 'Produtos' },
                { key: 'posts', label: 'Posts' },
                { key: 'hero', label: 'Hero Section' },
                { key: 'categories', label: 'Categorias' },
                { key: 'subcategories', label: 'Subcategorias' },
             ].map((page) => (
                <Grid item key={page.key} xs={isMobile ? 6 : 'auto'} md>
                 <Button
                    variant={selectedPage === page.key ? 'contained' : 'text'} // Use text for inactive tabs
                    fullWidth={isMobile} // Full width on mobile
                    onClick={() => {
                       setSelectedPage(page.key);
                       // Reset selections when changing tabs
                       setSelectedRowIds([]);
                       setSelectedPostRowIds([]);
                       setSelectedHeroRowIds([]);
                       setSelectedCategoryRowIds([]);
                       setSelectedSubcategoryRowIds([]);
                    }}
                    sx={{
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        borderBottom: selectedPage === page.key ? 2 : 0,
                        borderColor: 'primary.main',
                        borderRadius: 0, // Flat bottom edge
                        pb: 1, // Padding below text
                        px: isMobile ? 1 : 2,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                 >
                    {page.label}
                 </Button>
                 </Grid>
             ))}
        </Grid>
      </Box>

      {/* Central Loading Indicator */}
       {isLoading && selectedPage && ( // Show loading only when a page is selected and isLoading is true
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Carregando {selectedPage}...</Typography>
         </Box>
       )}

      {/* Conditional Content Rendering (only render if not loading) */}
      {!isLoading && (
        <>
        {/* --- PRODUCTS SECTION --- */}
        {selectedPage === 'products' && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2,
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<AddIcon />}
                  onClick={handleAddProduct}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<EditIcon />}
                  onClick={handleEditProduct}
                  disabled={selectedRowIds.length !== 1}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                aria-label="excluir produtos selecionados"
                color="error"
                onClick={handleOpenDeleteModal}
                disabled={selectedRowIds.length === 0}
                sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}
              >
                <DeleteIcon />
                 <Typography variant="caption" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                    Excluir ({selectedRowIds.length})
                 </Typography>
              </IconButton>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}> {/* Increased height */}
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSizeOptions={[10, 25, 50]} // More options
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                     // Optional: Sort by ID descending by default
                    // sorting: {
                    //    sortModel: [{ field: 'id', sort: 'desc' }],
                    // },
                }}
                checkboxSelection
                disableRowSelectionOnClick // Select only via checkbox
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedRowIds(ids);
                }}
                rowSelectionModel={selectedRowIds} // Control selection state
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                autoHeight={false} // Ensure container height is used
                density={isMobile ? 'compact' : 'standard'} // Adjust density
                 sx={{ '--DataGrid-overlayHeight': '300px' }} // For loading/no rows overlay
              />
            </Box>
            {renderProductForm()}
          </Box>
        )}

        {/* --- POSTS SECTION --- */}
        {selectedPage === 'posts' && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2,
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<AddIcon />}
                  onClick={handleAddPost}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<EditIcon />}
                  onClick={handleEditPost}
                  disabled={selectedPostRowIds.length !== 1}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                 aria-label="excluir posts selecionados"
                color="error"
                onClick={handleOpenDeletePostModal}
                disabled={selectedPostRowIds.length === 0}
                 sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}
              >
                <DeleteIcon />
                 <Typography variant="caption" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                    Excluir ({selectedPostRowIds.length})
                 </Typography>
              </IconButton>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={postsList}
                columns={postColumns}
                 pageSizeOptions={[10, 25, 50]}
                 initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedPostRowIds(ids);
                }}
                rowSelectionModel={selectedPostRowIds}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 autoHeight={false}
                 density={isMobile ? 'compact' : 'standard'}
                 sx={{ '--DataGrid-overlayHeight': '300px' }}
              />
            </Box>
            {renderPostForm()}
          </Box>
        )}

        {/* --- CATEGORIES SECTION --- */}
        {selectedPage === 'categories' && (
          <Box>
             <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2,
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={<EditIcon />}
                  onClick={handleEditCategory}
                  disabled={selectedCategoryRowIds.length !== 1}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                aria-label="excluir categorias selecionadas"
                color="error"
                onClick={handleOpenDeleteCategoryModal}
                disabled={selectedCategoryRowIds.length === 0}
                sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}
              >
                <DeleteIcon />
                 <Typography variant="caption" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                    Excluir ({selectedCategoryRowIds.length})
                 </Typography>
              </IconButton>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={categoriesList}
                columns={categoryColumns}
                 pageSizeOptions={[10, 25, 50]}
                 initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedCategoryRowIds(ids);
                }}
                rowSelectionModel={selectedCategoryRowIds}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 autoHeight={false}
                 density={isMobile ? 'compact' : 'standard'}
                 sx={{ '--DataGrid-overlayHeight': '300px' }}
              />
            </Box>
            {renderCategoryForm()}
          </Box>
        )}

        {/* --- SUBCATEGORIES SECTION --- */}
        {selectedPage === 'subcategories' && (
          <Box>
           <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2,
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                   size={isMobile ? 'small' : 'medium'}
                  startIcon={<AddIcon />}
                  onClick={handleAddSubcategory}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                   size={isMobile ? 'small' : 'medium'}
                  startIcon={<EditIcon />}
                  onClick={handleEditSubcategory}
                  disabled={selectedSubcategoryRowIds.length !== 1}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                 aria-label="excluir subcategorias selecionadas"
                color="error"
                onClick={handleOpenDeleteSubcategoryModal}
                disabled={selectedSubcategoryRowIds.length === 0}
                sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}
              >
                <DeleteIcon />
                <Typography variant="caption" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                    Excluir ({selectedSubcategoryRowIds.length})
                 </Typography>
              </IconButton>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={subcategoriesList}
                columns={subcategoryColumns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedSubcategoryRowIds(ids);
                }}
                rowSelectionModel={selectedSubcategoryRowIds}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 autoHeight={false}
                 density={isMobile ? 'compact' : 'standard'}
                 sx={{ '--DataGrid-overlayHeight': '300px' }}
              />
            </Box>
            {renderSubcategoryForm()}
          </Box>
        )}

        {/* --- HERO SECTION --- */}
         {selectedPage === 'hero' && (
            <Box>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    mb: 2,
                    gap: 1,
                }}
                >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenHeroModal('add')}
                    >
                    Adicionar
                    </Button>
                    <Button
                    variant="outlined"
                    color="secondary"
                     size={isMobile ? 'small' : 'medium'}
                    startIcon={<EditIcon />}
                    onClick={() => {
                        if (selectedHeroRowIds.length === 1) {
                        const heroToEdit = heroSections.find(
                            (hs) => hs.id === selectedHeroRowIds[0]
                        );
                        if (heroToEdit) {
                           handleOpenHeroModal('edit', heroToEdit);
                        } else {
                            alert("Hero Section não encontrada.")
                        }

                        } else {
                        alert('Selecione uma Hero Section para editar.');
                        }
                    }}
                    disabled={selectedHeroRowIds.length !== 1}
                    >
                    Editar
                    </Button>
                </Box>
                <IconButton
                     aria-label="excluir hero sections selecionadas"
                    color="error"
                    onClick={handleOpenDeleteHeroModal}
                    disabled={selectedHeroRowIds.length === 0}
                    sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}
                >
                    <DeleteIcon />
                    <Typography variant="caption" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                        Excluir ({selectedHeroRowIds.length})
                    </Typography>
                </IconButton>
                </Box>
                <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={heroSections}
                    columns={heroSectionColumns}
                    pageSizeOptions={[5, 10, 20]} // Fewer items expected here
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    onRowSelectionModelChange={(ids) => {
                    setSelectedHeroRowIds(ids);
                    }}
                    rowSelectionModel={selectedHeroRowIds}
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                     autoHeight={false}
                    density="standard" // Usually less dense data here
                    sx={{ '--DataGrid-overlayHeight': '300px' }}
                />
                </Box>
                {renderHeroSectionForm()}
            </Box>
         )}
        </>
      )}


       {/* --- DELETE CONFIRMATION MODALS (using helper) --- */}
        {renderDeleteConfirmationModal(
            isDeleteModalOpen,
            handleCloseDeleteModal,
            handleDeleteSelectedProductsAction,
            selectedRowIds.length,
            "produto"
        )}

        {renderDeleteConfirmationModal(
            isDeletePostModalOpen,
            handleCloseDeletePostModal,
            handleDeleteSelectedPostsAction,
            selectedPostRowIds.length,
            "post"
        )}

         {renderDeleteConfirmationModal(
            isDeleteCategoryModalOpen,
            handleCloseDeleteCategoryModal,
            handleDeleteSelectedCategoriesAction,
            selectedCategoryRowIds.length,
            "categoria"
        )}

         {renderDeleteConfirmationModal(
            isDeleteSubcategoryModalOpen,
            handleCloseDeleteSubcategoryModal,
            handleDeleteSelectedSubcategoriesAction,
            selectedSubcategoryRowIds.length,
            "subcategoria"
        )}

         {renderDeleteConfirmationModal(
            isDeleteHeroModalOpen,
            handleCloseDeleteHeroModal,
            handleDeleteSelectedHeroSections,
            selectedHeroRowIds.length,
            "Hero Section"
        )}


    </Box>
  );
};

export default AdminPanel;