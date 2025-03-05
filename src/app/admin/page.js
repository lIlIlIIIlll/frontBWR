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
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
  const [formData, setFormData] = useState({});

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
    setIsLoading(true);
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
        // fetchHeroSections(); // Recarrega após salvar - Now handled by useEffect
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
      setIsLoading(false);
      fetchHeroSections(); // Keep fetching here for hero sections, categories and subcategories use different approach
    }
  };

  const handleDeleteSelectedHeroSections = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
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
        setHeroSections(
          heroSections.filter((hs) => !selectedHeroRowIds.includes(hs.id))
        );
        setSelectedHeroRowIds([]);
        alert(`${successfulDeletes.length} Hero Sections excluídas com sucesso.`);
      } else {
        alert('Nenhuma Hero Section foi excluída.');
      }
    } catch (error) {
      console.error('Erro ao excluir Hero Sections:', error);
      alert('Erro ao excluir Hero Sections.');
    } finally {
      setIsLoading(false);
      setIsDeleteHeroModalOpen(false);
      fetchHeroSections(); // Keep fetching here for hero sections, categories and subcategories use different approach
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
        }
      } catch (error) {
        console.error('Erro ao buscar Hero Sections:', error);
      }
    }
  };

 const heroSectionColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
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
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: params.value,
            borderRadius: '50%',
            border: '1px solid black',
          }}
        />
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
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <IconButton
          onClick={handleCloseHeroModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="hero-modal-title" variant="h6" component="h2">
          {heroModalMode === 'add'
            ? 'Adicionar Hero Section'
            : 'Editar Hero Section'}
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Título"
          name="title"
          value={heroFormData.title}
          onChange={handleHeroInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Subtítulo"
          name="subtitle"
          value={heroFormData.subtitle}
          onChange={handleHeroInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="URL da Imagem"
          name="imageUrl"
          value={heroFormData.imageUrl}
          onChange={handleHeroInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Texto do Botão (CTA)"
          name="buttonText"
          value={heroFormData.buttonText}
          onChange={handleHeroInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Link do Botão (CTA)"
          name="buttonLink"
          value={heroFormData.buttonLink}
          onChange={handleHeroInputChange}
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClickColor}
            sx={{ mb: 1, textTransform: 'none' }}
          >
            {displayColorPicker ? 'Fechar Color Picker' : 'Escolher Cor do Texto'}
          </Button>
          {displayColorPicker && (
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
                }}
                onClick={handleCloseColor}
              />
              <ChromePicker
                color={heroFormData.colorText}
                onChange={handleColorChange}
              />
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveHeroSection}
          sx={{ mt: 2 }}
        >
          Salvar Hero Section
        </Button>
      </Box>
    </Modal>
  );

  const renderProductForm = () => (
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
          width: isMobile ? '90%' : '60%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {modalMode === 'add' ? 'Adicionar Produto' : 'Editar Produto'}
        </Typography>

        <TextField
          margin="normal"
          fullWidth
          label="Nome do Produto"
          name="nameProduct"
          value={formData.nameProduct}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Modelo do Produto"
          name="productModel"
          value={formData.productModel}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Descrição do Produto"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Informações Adicionais"
          name="additionalInfo"
          multiline
          rows={2}
          value={formData.additionalInfo}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Preço em R$"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Quantidade em Estoque"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="category-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="categoryId"
            value={formData.categoryId || ''}
            label="Categoria"
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="subcategory-select-label">Subcategoria</InputLabel>
          <Select
            labelId="subcategory-select-label"
            id="subcategory-select"
            name="subcategoryId"
            value={formData.subcategoryId || ''}
            label="Subcategoria"
            onChange={handleInputChange}
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={showTechnicalDetails}
              onChange={(e) => setShowTechnicalDetails(e.target.checked)}
              name="showTechnicalDetailsCheckbox"
              color="primary"
            />
          }
          label="Adicionar Detalhes Técnicos"
        />

        {showTechnicalDetails && (
          <Box sx={{ mt: 2, border: '1px solid #ccc', padding: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Detalhes Técnicos</Typography>
            <TextField fullWidth margin="normal" label="Vazão" name="flow" value={formData.technicalDetails?.flow || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Pressão" name="pressure" value={formData.technicalDetails?.pressure || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Rotação" name="rotation" value={formData.technicalDetails?.rotation || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Potência" name="power" value={formData.technicalDetails?.power || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Temperatura" name="temperature" value={formData.technicalDetails?.temperature || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Peso" name="weight" value={formData.technicalDetails?.weight || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Capacidade de Óleo" name="oilCapacity" value={formData.technicalDetails?.oilCapacity || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Entrada" name="inlet" value={formData.technicalDetails?.inlet || ''} onChange={handleTechnicalDetailsInputChange} />
            <TextField fullWidth margin="normal" label="Saída" name="outlet" value={formData.technicalDetails?.outlet || ''} onChange={handleTechnicalDetailsInputChange} />
          </Box>
        )}


        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveProduct}
          sx={{ mt: 3 }}
        >
          Salvar Produto
        </Button>
      </Box>
    </Modal>
  );

  const handleSavePost = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    const isEditMode = postModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/posts/${selectedPost.id}` // Use o endpoint correto para posts
      : `https://${API}/posts`; // Use o endpoint correto para posts
    const method = isEditMode ? 'PUT' : 'POST';

    const postData = {
      title: postFormData.title,
      subtitle: postFormData.subtitle,
      content: postFormData.content,
      imageUrl: postFormData.imageUrl,
      // ... adicione outros campos do seu formulário de post aqui se necessário
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

        if (isEditMode) {
          setPostsList(
            postsList.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
            )
          );
          alert('Post atualizado com sucesso!');
        } else {
          setPostsList([...postsList, updatedPost]);
          alert('Post adicionado com sucesso!');
        }
        setIsPostModalOpen(false);
        // fetchPosts(); // Recarrega a lista de posts após salvar - Now handled by useEffect

      } else {
        const errorData = await response.json();
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} post: ${
            errorData.message || 'Erro desconhecido'
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
        } post. Tente novamente mais tarde.`
      );
    } finally {
      setIsLoading(false);
      fetchPosts(); // Keep fetching here for posts, categories and subcategories use different approach
    }
  };

  // Função auxiliar para recarregar os produtos
  const fetchProducts = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
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
          }));
          setProducts(processedData);
        } else {
          console.error('Falha ao buscar produtos:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }
  };

  // Função auxiliar para recarregar os posts
  const fetchPosts = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`https://${API}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPostsList(data);
        } else {
          console.error('Falha ao buscar posts:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    }
  };

  // Função auxiliar para recarregar as categorias
  const fetchCategoriesList = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`https://${API}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategoriesList(data);
        } else {
          console.error('Falha ao buscar categorias:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }
  };

  const fetchCategories = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`https://${API}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Falha ao buscar categorias:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }
  };

  // Função auxiliar para recarregar as subcategorias
  const fetchSubcategoriesList = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`https://${API}/subcategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSubcategoriesList(data);
        } else {
          console.error('Falha ao buscar subcategorias:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar subcategorias:', error);
      }
    }
  };


  useEffect(() => {
    const checkToken = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/registro');
      }
    };

    checkToken();
    fetchProducts();
    fetchPosts(); // Carregar posts também ao montar o componente
    fetchHeroSections(); // Carrega Hero Sections
    fetchCategoriesList(); // Carrega Categorias
    fetchSubcategoriesList(); // Carrega Subcategorias
  }, [router]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async (categoryId) => {
      const token = sessionStorage.getItem('token');
      if (token && categoryId) {
        try {
          const response = await fetch(
            `https://${API}/subcategories?categoryId=${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSubcategories(data);
          } else {
            console.error(
              'Falha ao buscar subcategorias:',
              response.statusText
            );
          }
        } catch (error) {
          console.error('Erro ao buscar subcategorias:', error);
        }
      }
    };

    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    const fetchSubcategories = async (categoryId) => {
      const token = sessionStorage.getItem('token');
      if (token && categoryId) {
        try {
          const response = await fetch(
            `https://${API}/subcategories/categories/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSubcategories(data);
          } else {
            console.error(
              'Falha ao buscar subcategorias:',
              response.statusText
            );
          }
        } catch (error) {
          console.error('Erro ao buscar subcategorias:', error);
        }
      }
    };

    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  // Funções para CRUD de Produtos
  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
    setSelectedFile(null);
    setShowTechnicalDetails(false);
    setFormData({
      nameProduct: '',
      price: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
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
      productModel: '',
      additionalInfo: '',
      stockQuantity: 0,
    });
  };

  const handleEditProduct = () => {
    if (selectedRowIds.length === 1) {
      const productToEdit = products.find(
        (product) => product.id === selectedRowIds[0]
      );
      if (productToEdit) {
        setModalMode('edit');
        setSelectedProduct(productToEdit);
        setIsModalOpen(true);
        setShowTechnicalDetails(!!productToEdit.technicalDetails);
        setFormData({
          nameProduct: productToEdit.nameProduct,
          price: productToEdit.productValue,
          description: productToEdit.productDescription,
          categoryId: productToEdit.categoryId,
          subcategoryId: productToEdit.subcategoryId,
          technicalDetails: productToEdit.technicalDetails || {
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
          productModel: productToEdit.productModel,
          additionalInfo: productToEdit.additionalInfo,
          stockQuantity: productToEdit.stockQuantity,
        });
      }
    } else {
      alert('Por favor, selecione um produto para editar.');
    }
  };

  // Função de exclusão de PRODUTOS (renomeada para clareza)
  const handleDeleteSelectedProductsAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
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
        setProducts(
          products.filter((product) => !selectedRowIds.includes(product.id))
        );
        setSelectedRowIds([]);
        alert(`${successfulDeletes.length} produtos excluídos com sucesso.`);
      } else {
        alert('Nenhum produto foi excluído.');
      }
    } catch (error) {
      console.error('Erro ao excluir produtos:', error);
      alert('Erro ao excluir produtos.');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      fetchProducts(); // Keep fetching here for products, categories and subcategories use different approach
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
    setSelectedFile(file);
    console.log('file', file);
  };

// src/app/admin/page.js (Trechos relevantes com modificações)

const handleSaveProduct = async () => {
  setIsLoading(true);
  const token = sessionStorage.getItem('token');
  const isEditMode = modalMode === 'edit';
  const url = isEditMode
      ? `https://${API}/products/${selectedProduct.id}`
      : `https://${API}/products`;
  const method = isEditMode ? 'PUT' : 'POST';

  const price = parseFloat(formData.price);
  const stockQuantity = parseInt(formData.stockQuantity, 10);

  if (isNaN(price) || isNaN(stockQuantity)) {
      alert('Por favor, insira valores numéricos válidos para preço e quantidade em estoque.');
      setIsLoading(false); // Important: Stop loading if input is invalid
      return;
  }

  const detailsEmpty = {setSelectedProduct}

  const productData = {
      nameProduct: formData.nameProduct,
      description: formData.description,
      price: price,
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      productValue: price,
      productModel: formData.productModel,
      productDescription: formData.description,
      additionalInfo: formData.additionalInfo,
      stockQuantity: stockQuantity,
      technicalDetails: showTechnicalDetails ? formData.technicalDetails : null, // Keep this here
  };

  try {
      const productResponse = await fetch(url, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
      });

      if (productResponse.ok) {
          const updatedProduct = await productResponse.json();

          if (showTechnicalDetails) {
              // Await technical details *AFTER* product creation/update
              try {
                  await saveTechnicalDetails(selectedProduct.id, formData.technicalDetails, token, selectedProduct.technicalDetails ? false:true); // Pass isEditMode
                  console.log(selectedProduct.technicalDetails ? false:true);
                  
                } catch (techDetailsError) {
                  console.error('Erro ao salvar detalhes técnicos:', techDetailsError);
                  alert('Erro ao salvar detalhes técnicos.  O produto foi criado/atualizado, mas os detalhes técnicos podem não ter sido salvos.');
                  setIsLoading(false);
                  fetchProducts();
                  return; // Exit early if technical details fail
              }
          }

          // Update product list *AFTER* successful operations
          if (isEditMode) {
              setProducts(
                  products.map((product) =>
                      product.id === updatedProduct.id ? updatedProduct : product
                  )
              );
              alert('Produto atualizado com sucesso!');
          } else {
              setProducts([...products, updatedProduct]);
              alert('Produto adicionado com sucesso!');
          }
          setIsModalOpen(false);

      } else {
          const errorData = await productResponse.json();
          alert(
              `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} produto: ${errorData.message || 'Erro desconhecido'}`
          );
      }
  } catch (error) {
      console.error(
          `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto:`,
          error
      );
      alert(
          `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto. Tente novamente mais tarde.`
      );
  } finally {
      setIsLoading(false);
      fetchProducts(); // Keep fetching here for products
  }
};

const saveTechnicalDetails = async (productId, details, token, isEditMode) => {
  try {
    const method = selectedProduct.technicalDetails !== null ? 'PUT' : 'POST';
    const url = `https://${API}/technical-details`


      const response = await fetch(url, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...details,
              productId: productId,
          }),
      });
      
      if (!response.ok) {
          // Throw an error *before* trying to parse JSON on a non-OK response
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' })); //Try to get error, avoid json() error
          throw new Error(errorData.message || 'Falha ao salvar detalhes técnicos');
      }

      //Não precisa retornar nada
      //return await response.json();

  } catch (error) {
      console.error('Erro ao salvar detalhes técnicos:', error);
     throw error; // Re-throw the error so handleSaveProduct can catch it

  }
};


  // Funções para CRUD de Posts (corrigido e separado)
  const handleAddPost = () => {
    setPostModalMode('add');
    setSelectedPost(null);
    setIsPostModalOpen(true);
    setPostFormData({
      title: '',
      subtitle: '',
      content: '',
      imageUrl: '',
      media: [],
    });
  };

  const handleEditPost = () => {
    if (selectedPostRowIds.length === 1) {
      const postToEdit = postsList.find(post => post.id === selectedPostRowIds[0]);
      if (postToEdit) {
        setPostModalMode('edit');
        setSelectedPost(postToEdit);
        setIsPostModalOpen(true);
        setPostFormData({
          title: postToEdit.title,
          subtitle: postToEdit.subtitle,
          content: postToEdit.content,
          imageUrl: postToEdit.imageUrl,
          media: postToEdit.media || [],
        });
      }
    } else {
      alert('Por favor, selecione um post para editar.');
    }
  };

  // Função de exclusão de POSTS (CORRIGIDO - função separada para posts)
  const handleDeleteSelectedPostsAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

    try {
      const deletePromises = selectedPostRowIds.map((id) =>
        fetch(`https://${API}/posts/${id}`, { // Rota correta para posts
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
        setPostsList(
          postsList.filter((post) => !selectedPostRowIds.includes(post.id))
        );
        setSelectedPostRowIds([]);
        alert(`${successfulDeletes.length} posts excluídos com sucesso.`);
      } else {
        alert('Nenhum post foi excluído.');
      }
    } catch (error) {
      console.error('Erro ao excluir posts:', error);
      alert('Erro ao excluir posts.');
    } finally {
      setIsLoading(false);
      setIsDeletePostModalOpen(false);
      fetchPosts(); // Keep fetching here for posts, categories and subcategories use different approach
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
    setPostFormData({ ...postFormData, [e.target.name]: e.target.value });
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'stockQuantity') {
      const numericValue = name === 'price' ? parseFloat(value) : parseInt(value, 10);

      if (!isNaN(numericValue)) {
        setFormData({
          ...formData,
          [name]: numericValue,
        });
      } else {
        setFormData({
          ...formData,
          [name]: name === 'price' ? '' : 0,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTechnicalDetailsInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      technicalDetails: {
        ...formData.technicalDetails,
        [name]: value,
      },
    });
  };

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'nameProduct',
      headerName: 'Nome do Produto',
      width: 250,
      editable: false,
    },
    {
      field: 'productValue',
      headerName: 'Preço em R$',
      type: 'number',
      width: 130,
      editable: false,
    },
    { field: 'categoryName', headerName: 'Categoria', width: 150 },
    { field: 'subcategoryName', headerName: 'Subcategoria', width: 150 },
    { field: 'imagesCount', headerName: 'Imagens', width: 100 },
    {
      field: 'hasTechnicalDetails',
      headerName: 'Detalhes Técnicos',
      width: 150,
      type: 'boolean',
    },
    {
      field: 'productModel',
      headerName: 'Modelo do Produto',
      width: 200,
      editable: false,
    },
    {
      field: 'productDescription',
      headerName: 'Descrição do Produto',
      width: 300,
      editable: false,
    },
    {
      field: 'additionalInfo',
      headerName: 'Informações Adicionais',
      width: 300,
      editable: false,
    },
  ];

  const postColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Título', width: 300 },
    { field: 'subtitle', headerName: 'Subtítulo', width: 300 },
    { field: 'createdAt', headerName: 'Criado em', width: 200 },
    { field: 'updatedAt', headerName: 'Atualizado em', width: 200 },
  ];

  const categoryColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome da Categoria', width: 300 },
  ];

  const subcategoryColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome da Subcategoria', width: 300 },
    { field: 'categoryId', headerName: 'ID da Categoria Pai', width: 150 }, // Display categoryId
  ];


  // --- Category CRUD Functions ---
  const handleAddCategory = () => {
    setCategoryModalMode('add');
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
    setCategoryFormData({ name: '' });
  };

  const handleEditCategory = () => {
    if (selectedCategoryRowIds.length === 1) {
      const categoryToEdit = categoriesList.find(cat => cat.id === selectedCategoryRowIds[0]);
      if (categoryToEdit) {
        setCategoryModalMode('edit');
        setSelectedCategory(categoryToEdit);
        setIsCategoryModalOpen(true);
        setCategoryFormData({ name: categoryToEdit.name });
      }
    } else {
      alert('Selecione uma categoria para editar.');
    }
  };

  const handleSaveCategory = async () => {
    setIsLoading(true); // Start loading
    const token = sessionStorage.getItem('token');
    const isEditMode = categoryModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/categories/${selectedCategory.id}`
      : `https://${API}/categories`;
    const method = isEditMode ? 'PUT' : 'POST';

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
        const updatedCategory = await response.json();
        if (isEditMode) {
          setCategoriesList(
            categoriesList.map((cat) =>
              cat.id === updatedCategory.id ? updatedCategory : cat
            )
          );
          alert('Categoria atualizada com sucesso!');
        } else {
          setCategoriesList([...categoriesList, updatedCategory]);
          alert('Categoria adicionada com sucesso!');
        }
        setIsCategoryModalOpen(false);
        setCategoryChange(prev => prev + 1); // Trigger useEffect to refresh categories
      } else {
        const errorData = await response.json();
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria: ${errorData.message || 'Erro desconhecido'}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria. Tente novamente mais tarde.`
      );
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleDeleteSelectedCategoriesAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

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
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (successfulDeletes.length > 0) {
        setCategoriesList(
          categoriesList.filter((cat) => !selectedCategoryRowIds.includes(cat.id))
        );
        setSelectedCategoryRowIds([]);
        alert(`${successfulDeletes.length} categorias excluídas com sucesso.`);
      } else {
        alert('Nenhuma categoria foi excluída.');
      }
    } catch (error) {
      console.error('Erro ao excluir categorias:', error);
      alert('Erro ao excluir categorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteCategoryModalOpen(false);
      setCategoryChange(prev => prev + 1); // Trigger useEffect to refresh categories
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
  };

  const renderCategoryForm = () => (
    <Modal
      open={isCategoryModalOpen}
      onClose={handleCloseCategoryModal}
      aria-labelledby="category-modal-title"
      aria-describedby="category-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '40%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          onClick={handleCloseCategoryModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="category-modal-title" variant="h6" component="h2">
          {categoryModalMode === 'add' ? 'Adicionar Categoria' : 'Editar Categoria'}
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Nome da Categoria"
          name="name"
          value={categoryFormData.name}
          onChange={handleCategoryInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveCategory}
          sx={{ mt: 2 }}
        >
          Salvar Categoria
        </Button>
      </Box>
    </Modal>
  );

  // --- Subcategory CRUD Functions ---
  const handleAddSubcategory = () => {
    setSubcategoryModalMode('add');
    setSelectedSubcategory(null);
    setIsSubcategoryModalOpen(true);
    setSubcategoryFormData({ name: '', categoryId: '' });
  };

  const handleEditSubcategory = () => {
    if (selectedSubcategoryRowIds.length === 1) {
      const subcategoryToEdit = subcategoriesList.find(sub => sub.id === selectedSubcategoryRowIds[0]);
      if (subcategoryToEdit) {
        setSubcategoryModalMode('edit');
        setSelectedSubcategory(subcategoryToEdit);
        setIsSubcategoryModalOpen(true);
        setSubcategoryFormData({ name: subcategoryToEdit.name, categoryId: subcategoryToEdit.categoryId });
      }
    } else {
      alert('Selecione uma subcategoria para editar.');
    }
  };

  const handleSaveSubcategory = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    const isEditMode = subcategoryModalMode === 'edit';
    const url = isEditMode
      ? `https://${API}/subcategories/${selectedSubcategory.id}`
      : `https://${API}/subcategories`;
    const method = isEditMode ? 'PUT' : 'POST';

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
        const updatedSubcategory = await response.json();
        if (isEditMode) {
          setSubcategoriesList(
            subcategoriesList.map((sub) =>
              sub.id === updatedSubcategory.id ? updatedSubcategory : sub
            )
          );
          alert('Subcategoria atualizada com sucesso!');
        } else {
          setSubcategoriesList([...subcategoriesList, updatedSubcategory]);
          alert('Subcategoria adicionada com sucesso!');
        }
        setIsSubcategoryModalOpen(false);
        setSubcategoryChange(prev => prev + 1); // Trigger useEffect to refresh subcategories
      } else {
        const errorData = await response.json();
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria: ${errorData.message || 'Erro desconhecido'}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria. Tente novamente mais tarde.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelectedSubcategoriesAction = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

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
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (successfulDeletes.length > 0) {
        setSubcategoriesList(
          subcategoriesList.filter((sub) => !selectedSubcategoryRowIds.includes(sub.id))
        );
        setSelectedSubcategoryRowIds([]);
        alert(`${successfulDeletes.length} subcategorias excluídas com sucesso.`);
      } else {
        alert('Nenhuma subcategoria foi excluída.');
      }
    } catch (error) {
      console.error('Erro ao excluir subcategorias:', error);
      alert('Erro ao excluir subcategorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteSubcategoryModalOpen(false);
      setSubcategoryChange(prev => prev + 1); // Trigger useEffect to refresh subcategories
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
  };

  const renderSubcategoryForm = () => (
    <Modal
      open={isSubcategoryModalOpen}
      onClose={handleCloseSubcategoryModal}
      aria-labelledby="subcategory-modal-title"
      aria-describedby="subcategory-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '40%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          onClick={handleCloseSubcategoryModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="subcategory-modal-title" variant="h6" component="h2">
          {subcategoryModalMode === 'add' ? 'Adicionar Subcategoria' : 'Editar Subcategoria'}
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Nome da Subcategoria"
          name="name"
          value={subcategoryFormData.name}
          onChange={handleSubcategoryInputChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="subcategory-category-select-label">Categoria Pai</InputLabel>
          <Select
            labelId="subcategory-category-select-label"
            id="subcategory-category-select"
            name="categoryId"
            value={subcategoryFormData.categoryId}
            label="Categoria Pai"
            onChange={handleSubcategoryInputChange}
          >
            <MenuItem value="">
              <em>Nenhuma</em>
            </MenuItem>
            {categoriesList.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSubcategory}
          sx={{ mt: 2 }}
        >
          Salvar Subcategoria
        </Button>
      </Box>
    </Modal>
  );


  // Função para renderizar o formulário de produto (já existente)...

  // Função para renderizar o formulário de post
  const renderPostForm = () => (
    <Modal
      open={isPostModalOpen}
      onClose={handleClosePostModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '60%', // Ajuste largura para o modal de post
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <IconButton
          onClick={handleClosePostModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {postModalMode === 'add' ? 'Adicionar Post' : 'Editar Post'}
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Título do Post"
          name="title"
          value={postFormData.title}
          onChange={handlePostInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Subtítulo do Post"
          name="subtitle"
          value={postFormData.subtitle}
          onChange={handlePostInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Conteúdo do Post"
          multiline
          rows={8} // Aumentei para dar mais espaço para o conteúdo
          name="content"
          value={postFormData.content}
          onChange={handlePostInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="URL da Imagem de Destaque"
          name="imageUrl"
          value={postFormData.imageUrl}
          onChange={handlePostInputChange}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePost}
          sx={{ mt: 2 }}
        >
          Salvar Post
        </Button>
      </Box>
    </Modal>
  );

  // useEffect to refresh categories and subcategories list
  useEffect(() => {
    fetchCategoriesList();
    fetchCategories();
  }, [categoryChange]);

  useEffect(() => {
    fetchSubcategoriesList();
  }, [subcategoryChange]);


  return (
    <Box sx={{ p: 4, pt: isMobile ? '85px' : '113px', maxWidth: '100vw' }}>
      <Typography variant="h4" gutterBottom>
        Painel de Administração
      </Typography>

      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} md={2}>
          <Button
            variant={selectedPage === 'products' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => setSelectedPage('products')}
          >
            Produtos
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant={selectedPage === 'posts' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => setSelectedPage('posts')}
          >
            Posts
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant={selectedPage === 'hero' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => setSelectedPage('hero')}
          >
            Hero Section
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant={selectedPage === 'categories' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => setSelectedPage('categories')}
          >
            Categorias
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant={selectedPage === 'subcategories' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => setSelectedPage('subcategories')}
          >
            Subcategorias
          </Button>
        </Grid>
      </Grid>

      {/* Conteúdo das seções */}
      {isLoading ? (
        <Typography variant="h6">Carregando...</Typography>
      ) : (
        <>
        {selectedPage === 'products' && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddProduct}
                >
                  Adicionar Produto
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={handleEditProduct}
                  disabled={selectedRowIds.length !== 1}
                >
                  Editar Produto
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteModal}
                disabled={selectedRowIds.length === 0}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick={true}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedRowIds(ids);
                }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
            {renderProductForm()}
          </>
        )}

        {selectedPage === 'posts' && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddPost}
                >
                  Adicionar Post
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={handleEditPost}
                  disabled={selectedPostRowIds.length !== 1}
                >
                  Editar Post
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeletePostModal}
                disabled={selectedPostRowIds.length === 0}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={postsList}
                columns={postColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick={true}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedPostRowIds(ids);
                }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
            {renderPostForm()}
            {renderPostForm()}
          </>
        )}

        {selectedPage === 'categories' && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                >
                  Adicionar Categoria
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={handleEditCategory}
                  disabled={selectedCategoryRowIds.length !== 1}
                >
                  Editar Categoria
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteCategoryModal}
                disabled={selectedCategoryRowIds.length === 0}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={categoriesList}
                columns={categoryColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick={true}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedCategoryRowIds(ids);
                }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
            {renderCategoryForm()}
          </>
        )}

        {selectedPage === 'subcategories' && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddSubcategory}
                >
                  Adicionar Subcategoria
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={handleEditSubcategory}
                  disabled={selectedSubcategoryRowIds.length !== 1}
                >
                  Editar Subcategoria
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteSubcategoryModal}
                disabled={selectedSubcategoryRowIds.length === 0}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={subcategoriesList}
                columns={subcategoryColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick={true}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(ids) => {
                  setSelectedSubcategoryRowIds(ids);
                }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
            {renderSubcategoryForm()}
          </>
        )}
        </>
      )}


      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedRowIds.length} produto(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeleteModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedProductsAction} // Correção aqui! Usar a função de exclusão de PRODUTOS
              variant="contained"
              color="error"
            >
              Sim, Excluir
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isDeletePostModalOpen}
        onClose={handleCloseDeletePostModal}
        aria-labelledby="delete-post-modal-title"
        aria-describedby="delete-post-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="delete-post-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão de Posts
          </Typography>
          <Typography id="delete-post-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedPostRowIds.length} post(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeletePostModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedPostsAction} // Correção AQUI! Usar a função correta para excluir POSTS!
              variant="contained"
              color="error"
            >
              Sim, Excluir Posts
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isDeleteCategoryModalOpen}
        onClose={handleCloseDeleteCategoryModal}
        aria-labelledby="delete-category-modal-title"
        aria-describedby="delete-category-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="delete-category-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão de Categorias
          </Typography>
          <Typography id="delete-category-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedCategoryRowIds.length} categoria(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeleteCategoryModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedCategoriesAction}
              variant="contained"
              color="error"
            >
              Sim, Excluir Categorias
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isDeleteSubcategoryModalOpen}
        onClose={handleCloseDeleteSubcategoryModal}
        aria-labelledby="delete-subcategory-modal-title"
        aria-describedby="delete-subcategory-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="delete-subcategory-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão de Subcategorias
          </Typography>
          <Typography id="delete-subcategory-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedSubcategoryRowIds.length} subcategoria(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeleteSubcategoryModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedSubcategoriesAction}
              variant="contained"
              color="error"
            >
              Sim, Excluir Subcategorias
            </Button>
          </Box>
        </Box>
      </Modal>


      {/* Hero Section Management */}
      {selectedPage === 'hero' && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenHeroModal('add')}
              >
                Adicionar Hero Section
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<EditIcon />}
                onClick={() => {
                  if (selectedHeroRowIds.length === 1) {
                    const heroToEdit = heroSections.find(
                      (hs) => hs.id === selectedHeroRowIds[0]
                    );
                    handleOpenHeroModal('edit', heroToEdit);
                  } else {
                    alert('Por favor, selecione uma Hero Section para editar.');
                  }
                }}
                disabled={selectedHeroRowIds.length !== 1}
              >
                Editar Hero Section
              </Button>
            </Box>
            <IconButton
              color="error"
              onClick={handleOpenDeleteHeroModal}
              disabled={selectedHeroRowIds.length === 0}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={heroSections}
              columns={heroSectionColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick={true}
              getRowId={(row) => row.id}
              onRowSelectionModelChange={(ids) => {
                setSelectedHeroRowIds(ids);
              }}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </div>
          {renderHeroSectionForm()}
          <Modal
            open={isDeleteHeroModalOpen}
            onClose={handleCloseDeleteHeroModal}
            aria-labelledby="delete-hero-modal-title"
            aria-describedby="delete-hero-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                id="delete-hero-modal-title"
                variant="h6"
                component="h2"
              >
                Confirmação de Exclusão
              </Typography>
              <Typography id="delete-hero-modal-description" sx={{ mt: 2 }}>
                Deseja realmente excluir {selectedHeroRowIds.length} Hero
                Section(s)?
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseDeleteHeroModal} sx={{ mr: 2 }}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteSelectedHeroSections}
                  variant="contained"
                  color="error"
                >
                  Sim, Excluir
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;