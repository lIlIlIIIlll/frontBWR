
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
  Chip, // Manter Chip para Autocomplete
  Autocomplete, // <-- NOVO: Importar Autocomplete
  // OutlinedInput, // Não mais necessário para Select multiple
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
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


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
  const [searchQuery, setSearchQuery] = useState('');

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
  // Estado unificado para formulários (Produto, etc.)
  const [formData, setFormData] = useState({
    // Campos de Produto
    nameProduct: '',
    price: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    productModel: '',
    additionalInfo: '',
    stockQuantity: 0,
    technicalDetails: {}, // Inicializado aqui
    relatedProductIds: [], // <-- MANTÉM: Para IDs de produtos relacionados
    productFrete: false, // <-- MANTÉM: Para tipo de frete
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
      setIsLoading(false); // Adicionado para parar o loading em caso de erro de token
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
      const failedDeletes = results.filter(
        (result) => result.status === 'rejected' || !result.value.ok
      );


      if (successfulDeletes.length > 0) {
        setHeroSections(
          heroSections.filter((hs) => !selectedHeroRowIds.includes(hs.id))
        );
        setSelectedHeroRowIds([]);
        alert(`${successfulDeletes.length} Hero Section(s) excluída(s) com sucesso.`);
      }
      if (failedDeletes.length > 0) {
        // Poderia logar os erros específicos aqui
        console.error("Falha ao excluir Hero Sections:", failedDeletes);
        alert(`Falha ao excluir ${failedDeletes.length} Hero Section(s).`);
      }
      if (successfulDeletes.length === 0 && failedDeletes.length === 0) {
        alert('Nenhuma Hero Section selecionada foi encontrada para exclusão.');
      }
    } catch (error) {
      console.error('Erro ao excluir Hero Sections:', error);
      alert('Erro ao excluir Hero Sections.');
    } finally {
      setIsLoading(false);
      setIsDeleteHeroModalOpen(false);
      // fetchHeroSections(); // Não é estritamente necessário se a atualização local funcionar
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
           setHeroSections([]); // Limpa em caso de falha
        }
      } catch (error) {
        console.error('Erro ao buscar Hero Sections:', error);
         setHeroSections([]); // Limpa em caso de erro
      }
    } else {
        setHeroSections([]); // Limpa se não houver token
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
            backgroundColor: params,
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
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Hero Section'}
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
          width: isMobile ? '90%' : '70%', // Aumentado para caber mais campos
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

        <Grid container spacing={2}> {/* Usar Grid para organizar */}
            <Grid item xs={12} sm={6}>
                 <TextField
                    margin="normal"
                    fullWidth
                    label="Nome do Produto"
                    name="nameProduct"
                    value={formData.nameProduct || ''}
                    onChange={handleInputChange}
                 />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Modelo do Produto"
                    name="productModel"
                    value={formData.productModel || ''}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Descrição do Produto"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Informações Adicionais"
                    name="additionalInfo"
                    multiline
                    rows={2}
                    value={formData.additionalInfo || ''}
                    onChange={handleInputChange}
                />
            </Grid>
             <Grid item xs={12} sm={6}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Preço em R$"
                    name="price"
                    type="number" // Manter como number
                    value={formData.price || ''} // Controlar valor
                    onChange={handleInputChange}
                    // InputProps={{ inputProps: { min: 0, step: 0.01 } }} // Opcional: formatação
                 />
            </Grid>
             <Grid item xs={12} sm={6}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Quantidade em Estoque"
                    name="stockQuantity"
                    type="number" // Manter como number
                    value={formData.stockQuantity || 0} // Controlar valor
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 0 } }} // Opcional: garantir não negativo
                 />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                <FormControl fullWidth margin="normal" disabled={!formData.categoryId}> {/* Desabilitar se não houver categoria */}
                  <InputLabel id="subcategory-select-label">Subcategoria</InputLabel>
                  <Select
                    labelId="subcategory-select-label"
                    id="subcategory-select"
                    name="subcategoryId"
                    value={formData.subcategoryId || ''}
                    label="Subcategoria"
                    onChange={handleInputChange}
                  >
                     <MenuItem value=""><em>Nenhuma</em></MenuItem>
                    {subcategoriesList.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>

            {/* --- NOVO CAMPO: Produtos Relacionados com Autocomplete --- */}
              <Grid item xs={12}>
                <Autocomplete
                    multiple
                    id="related-products-autocomplete"
                    options={products.filter(p => p?.id !== selectedProduct?.id)} // Filtra o próprio produto e produtos nulos/inválidos
                    getOptionLabel={(option) => option?.nameProduct || ''} // Como exibir o nome na lista (com segurança)
                    // Define o valor baseado nos IDs armazenados, buscando os objetos correspondentes
                    value={
                        (() => { // Usar uma IIFE para encapsular a lógica
                            let relatedIdsArray = [];
                            const relatedIdsValue = formData.relatedProductIds;

                            // Passo 1: Converter relatedIdsValue para um array de strings de IDs, se necessário
                            if (typeof relatedIdsValue === 'string' && relatedIdsValue.length > 0) {
                                // Se for string vírgula-separada
                                relatedIdsArray = relatedIdsValue
                                    .split(',')
                                    .map(idStr => idStr.trim()) // Remove espaços
                                    .filter(idStr => idStr !== ''); // Remove vazios
                            } else if (Array.isArray(relatedIdsValue)) {
                                // Se já for array, converte cada elemento para string e remove vazios/nulos
                                relatedIdsArray = relatedIdsValue
                                    .map(id => String(id ?? '').trim()) // Converte para string (tratando null/undefined) e trim
                                    .filter(idStr => idStr !== ''); // Remove vazios
                            }
                            // Neste ponto, relatedIdsArray é um array de strings de IDs ['1', '5', '10']

                            // Passo 2: Buscar os objetos Product correspondentes aos IDs (strings)
                            const selectedProducts = relatedIdsArray
                                .map(idStr => {
                                    // Compara o ID string (idStr) com o product.id (convertido para string)
                                    const foundProduct = products.find(p => p && String(p.id) === idStr);
                                    return foundProduct;
                                })
                                .filter(p => p != null); // Filtra produtos não encontrados (null)

                            return selectedProducts; // Retorna o array de objetos Product
                        })()
                    }
                    onChange={(event, newValue) => {
                        // Atualiza o formData apenas com os IDs dos produtos selecionados
                        // O Autocomplete passa os objetos completos em newValue
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            // Mapeia os objetos de volta para um array de IDs (mantendo como números ou strings, dependendo do ID original)
                            relatedProductIds: newValue.map(item => item.id),
                        }));
                    }}
                    // Garante que a comparação para saber se uma opção está selecionada use string vs string
                    isOptionEqualToValue={(option, value) => option && value && String(option.id) === String(value.id)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Produtos Relacionados"
                            placeholder="Digite para buscar..."
                            margin="normal"
                        />
                    )}
                    renderTags={(value, getTagProps) => // Como renderizar os chips dos selecionados
                        value.map((option, index) => (
                           option && // Garante que option existe antes de renderizar o Chip
                            <Chip
                                variant="outlined"
                                label={option.nameProduct}
                                {...getTagProps({ index })}
                                key={option.id} // Usar key aqui
                            />
                        ))
                    }
                    fullWidth
                 />
            </Grid>
             {/* --- Fim do Novo Campo com Autocomplete --- */}

             {/* --- NOVO CAMPO: Checkbox de Frete --- */}
             <Grid item xs={12}>
                 <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.productFrete || false}
                        onChange={handleInputChange} // Reutiliza o handler
                        name="productFrete" // Nome do campo no estado
                        color="primary"
                        />
                    }
                    label="Calcular Frete Automaticamente (se desmarcado, será manual via WhatsApp)"
                 />
             </Grid>
              {/* --- Fim do Novo Campo --- */}

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
                <Box sx={{ mt: 1, mb: 2, border: '1px solid #ccc', padding: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>Detalhes Técnicos</Typography>
                   <Grid container spacing={2}>
                     {/* Mapear campos técnicos para evitar repetição */}
                     {[
                       { name: 'flow', label: 'Vazão' },
                       { name: 'pressure', label: 'Pressão' },
                       { name: 'rotation', label: 'Rotação' },
                       { name: 'power', label: 'Potência' },
                       { name: 'temperature', label: 'Temperatura' },
                       { name: 'weight', label: 'Peso' },
                       { name: 'oilCapacity', label: 'Capacidade de Óleo' },
                       { name: 'inlet', label: 'Entrada' },
                       { name: 'outlet', label: 'Saída' },
                     ].map(field => (
                         <Grid item xs={12} sm={6} md={4} key={field.name}>
                             <TextField
                                 fullWidth
                                 margin="dense" // Usar dense para economizar espaço
                                 label={field.label}
                                 name={field.name}
                                 value={formData.technicalDetails?.[field.name] || ''}
                                 onChange={handleTechnicalDetailsInputChange}
                             />
                         </Grid>
                     ))}
                    </Grid>
                </Box>
              </Grid>
            )}
        </Grid> {/* Fim do Grid container principal */}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveProduct}
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Produto'}
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
     // setIsLoading(true); // Opcional: indicar carregamento na tabela
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
            // Garante que hasTechnicalDetails seja booleano
            hasTechnicalDetails: !!product.technicalDetails && Object.keys(product.technicalDetails).length > 0,
            // Certifique-se de que os novos campos também sejam processados se vierem da API
            relatedProductIds: product.relatedProductIds || [],
            productFrete: product.productFrete || false,
            // Garante que price e stockQuantity sejam números ou null/0
            price: product.price ?? null,
            productValue: product.productValue ?? product.price ?? null,
            stockQuantity: product.stockQuantity ?? 0,
          }));
          setProducts(processedData);
        } else {
          console.error('Falha ao buscar produtos:', response.statusText);
           setProducts([]); // Limpa em caso de falha
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
         setProducts([]); // Limpa em caso de erro
      } finally {
         // setIsLoading(false);
      }
    } else {
       setProducts([]); // Limpa se não houver token
       // setIsLoading(false);
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
           setPostsList([]);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
         setPostsList([]);
      }
    } else {
       setPostsList([]);
    }
  };

  // Função auxiliar para recarregar as categorias (usada na tabela e nos forms)
  const fetchCategoriesAndRelated = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`https://${API}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCategoriesList(data); // Para a tabela de categorias
                setCategories(data);     // Para os dropdowns dos forms
            } else {
                console.error('Falha ao buscar categorias:', response.statusText);
                setCategoriesList([]);
                setCategories([]);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setCategoriesList([]);
            setCategories([]);
        }
    } else {
        setCategoriesList([]);
        setCategories([]);
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
          // Adiciona o nome da categoria pai para exibição
          // Usa a lista 'categories' que já deve ter sido carregada
          const subcategoriesWithParent = data.map(sub => {
             const parentCategory = categories.find(c => c.id === sub.categoryId);
             return { ...sub, categoryName: parentCategory?.name || 'N/A' };
          });
          setSubcategoriesList(subcategoriesWithParent);
        } else {
          console.error('Falha ao buscar subcategorias:', response.statusText);
           setSubcategoriesList([]);
        }
      } catch (error) {
        console.error('Erro ao buscar subcategorias:', error);
         setSubcategoriesList([]);
      }
    } else {
         setSubcategoriesList([]);
    }
  };


  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      setIsLoading(true); // Inicia o loading geral
      const token = sessionStorage.getItem('token');
      const email = sessionStorage.getItem('email');

      if(!token || email !== 'admin@admin.com'){
        console.log('Usuário não autorizado ou não logado.');
        router.push('/registro'); // Redireciona para login/registro
        // Não precisa setar isLoading false aqui, pois o redirecionamento ocorrerá
      } else {
        try {
            // Busca categorias primeiro, pois subcategorias dependem delas
            await fetchCategoriesAndRelated();
            // Busca o resto em paralelo
            await Promise.all([
                fetchProducts(),
                fetchPosts(),
                fetchHeroSections(),
                fetchSubcategoriesList() // Agora usa a lista de categorias carregada
            ]);
        } catch (error) {
            console.error("Erro ao buscar dados iniciais:", error);
            // Tratar erro geral de busca, talvez mostrar uma mensagem
        } finally {
            setIsLoading(false); // Finaliza o loading geral após todas as buscas
        }
      }
    };

    checkTokenAndFetchData();
  }, [router]); // Dependência do router é suficiente aqui


  // Buscar subcategorias baseadas na categoria selecionada no formulário de produto
  useEffect(() => {
    const fetchSubcategoriesForForm = async (categoryId) => {
       // setIsLoading(true); // Opcional: loading específico para subcategorias
      const token = sessionStorage.getItem('token');
      if (token && categoryId) {
        try {
          const response = await fetch(
            `https://${API}/subcategories/${categoryId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSubcategories(data); // Atualiza as subcategorias disponíveis para o select
          } else {
            console.error('Falha ao buscar subcategorias para o formulário:', response.statusText);
            setSubcategories([]); // Limpa se falhar
          }
        } catch (error) {
          console.error('Erro ao buscar subcategorias para o formulário:', error);
          setSubcategories([]); // Limpa em caso de erro
        } finally {
           // setIsLoading(false);
        }
      } else {
         setSubcategories([]); // Limpa se não houver categoria selecionada
          // setIsLoading(false);
      }
    };

    if (formData.categoryId) {
      fetchSubcategoriesForForm(formData.categoryId);
    } else {
       // Limpa subcategoria selecionada e a lista de opções se a categoria for desmarcada
       if (formData.subcategoryId) { // Só atualiza se já havia uma subcategoria
           setFormData(prev => ({ ...prev, subcategoryId: '' }));
       }
       setSubcategories([]);
    }
  }, [formData.categoryId]); // Depende da categoria selecionada no formData


  // Funções para CRUD de Produtos
  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
    setSelectedFile(null);
    setShowTechnicalDetails(false);
    // Limpa o formData completamente para um novo produto
    setFormData({
      nameProduct: '',
      price: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      technicalDetails: { // Reinicia detalhes técnicos
        flow: '', pressure: '', rotation: '', power: '', temperature: '',
        weight: '', oilCapacity: '', inlet: '', outlet: '',
      },
      productModel: '',
      additionalInfo: '',
      stockQuantity: 0,
      relatedProductIds: [], // <-- Limpa relacionados
      productFrete: false, // <-- Reseta frete
    });
     setSubcategories([]); // Limpa as opções de subcategoria também
  };

  const handleEditProduct = () => {
    if (selectedRowIds.length === 1) {
      const productToEdit = products.find(
        (product) => product?.id === selectedRowIds[0] // Verifica se product existe
      );
      if (productToEdit) {
        setModalMode('edit');
        setSelectedProduct(productToEdit); // Armazena o produto sendo editado
        setIsModalOpen(true);
        // Define se mostra detalhes técnicos baseado na existência deles no produto
        setShowTechnicalDetails(!!productToEdit.technicalDetails && Object.keys(productToEdit.technicalDetails).length > 0);
        // Preenche o formData com os dados do produto a editar
        setFormData({
          nameProduct: productToEdit.nameProduct || '',
          price: productToEdit.productValue ?? productToEdit.price ?? '', // Prioriza productValue, depois price, depois vazio
          description: productToEdit.productDescription || productToEdit.description || '', // Prioriza productDescription
          categoryId: productToEdit.categoryId || '',
          subcategoryId: productToEdit.subcategoryId || '',
          technicalDetails: productToEdit.technicalDetails || { // Garante que technicalDetails seja um objeto
            flow: '', pressure: '', rotation: '', power: '', temperature: '',
            weight: '', oilCapacity: '', inlet: '', outlet: '',
          },
          productModel: productToEdit.productModel || '',
          additionalInfo: productToEdit.additionalInfo || '',
          stockQuantity: productToEdit.stockQuantity ?? 0, // Usa ?? para aceitar 0
          relatedProductIds: productToEdit.relatedProductIds || [], // <-- Carrega relacionados existentes
          productFrete: productToEdit.productFrete || false, // <-- Carrega estado do frete
        });
         // Importante: Disparar a busca de subcategorias para a categoria atual
         if(productToEdit.categoryId) {
            // A busca será feita pelo useEffect que depende de formData.categoryId
         } else {
            setSubcategories([]); // Limpa se não houver categoria
         }
      } else {
        alert('Produto selecionado não encontrado ou inválido.');
      }
    } else {
      alert('Por favor, selecione UM produto para editar.');
    }
  };

  // Função de exclusão de PRODUTOS (renomeada para clareza)
  const handleDeleteSelectedProductsAction = async () => {
    setIsLoading(true);
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
      let successfulDeletes = 0;
      let failedDeletes = 0;

       results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.ok) {
          successfulDeletes++;
        } else {
          failedDeletes++;
          console.error("Falha ao excluir produto:", result.reason || result.value?.statusText);
        }
      });

      if (successfulDeletes > 0) {
         // Atualiza o estado local removendo os produtos excluídos
         setProducts(products.filter((product) => product && !selectedRowIds.includes(product.id))); // Adiciona verificação de 'product'
         setSelectedRowIds([]); // Limpa a seleção
         alert(`${successfulDeletes} produto(s) excluído(s) com sucesso.`);
      }
      if (failedDeletes > 0) {
          alert(`${failedDeletes} produto(s) não puderam ser excluídos. Verifique o console para mais detalhes.`);
      }
      if (successfulDeletes === 0 && failedDeletes === 0) {
           alert('Nenhum produto selecionado ou encontrado para exclusão.');
      }

    } catch (error) {
      console.error('Erro geral ao excluir produtos:', error);
      alert('Ocorreu um erro ao tentar excluir os produtos.');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      // Não precisa refetch aqui pois já atualizamos o estado local
      // fetchProducts(); // Desnecessário se a atualização local funcionar bem
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

  // Validação básica de campos numéricos
  const price = parseFloat(String(formData.price).replace(',', '.')); // Tratar vírgula
  const stockQuantity = parseInt(String(formData.stockQuantity), 10);

  if (isNaN(price) || price < 0) { // Preço não pode ser negativo
      alert('Por favor, insira um valor numérico válido e não negativo para o preço.');
      setIsLoading(false);
      return;
  }
   if (isNaN(stockQuantity) || stockQuantity < 0) { // Estoque não pode ser negativo
      alert('Por favor, insira um valor numérico válido e não negativo para a quantidade em estoque.');
      setIsLoading(false);
      return;
  }
   // Validação de campos obrigatórios (exemplo)
   if (!formData.nameProduct || !formData.categoryId) {
       alert('Nome do Produto e Categoria são obrigatórios.');
       setIsLoading(false);
       return;
   }


  // Monta o payload do produto principal
  const productData = {
      nameProduct: formData.nameProduct,
      description: formData.description, // Usar description aqui
      price: price, // Usar o valor parseado
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId || null, // Enviar null se vazio
      productValue: price, // Garantir que productValue também seja enviado/atualizado
      productModel: formData.productModel,
      productDescription: formData.description, // Garantir que productDescription também seja enviado/atualizado
      additionalInfo: formData.additionalInfo,
      stockQuantity: stockQuantity, // Usar o valor parseado
      // Dados novos:
      relatedProductIds: formData.relatedProductIds || [],
      productFrete: formData.productFrete || false,
      // Detalhes técnicos serão tratados separadamente se necessário após salvar o produto
      // Incluir technicalDetails apenas se showTechnicalDetails for true E houver dados
      technicalDetails: (showTechnicalDetails && formData.technicalDetails && Object.keys(formData.technicalDetails).some(k => formData.technicalDetails[k])) ? formData.technicalDetails : null,
  };

  // Remover chaves com valor null ou undefined antes de enviar, se a API exigir
  // Object.keys(productData).forEach(key => (productData[key] == null || productData[key] === '') && delete productData[key]);
  // Cuidado ao remover chaves, pode ser necessário enviar null explicitamente


  try {
      // 1. Salvar/Atualizar o Produto Principal
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
          throw new Error(`Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} produto: ${errorData.message}`);
      }

      const savedOrUpdatedProduct = await productResponse.json();
      const productId = savedOrUpdatedProduct.id; // Pegar o ID do produto salvo/atualizado

      // Busca nomes de categoria/subcategoria para atualizar estado local
       const categoryName = categories.find(c => c.id === savedOrUpdatedProduct.categoryId)?.name ?? 'N/A';
       let subcategoryName = 'N/A';
       // Para subcategoria, é melhor buscar da lista completa (subcategoriesList) se possível
       if (savedOrUpdatedProduct.subcategoryId) {
           const subcat = subcategoriesList.find(s => s.id === savedOrUpdatedProduct.subcategoryId);
           if (subcat) {
               subcategoryName = subcat.name;
           } else {
               // Se não encontrou na lista (pode acontecer se a lista não estiver 100% sync),
               // poderia fazer um fetch específico aqui, mas por simplicidade deixamos N/A
               console.warn(`Subcategoria ID ${savedOrUpdatedProduct.subcategoryId} não encontrada na lista local.`);
           }
       }


      // Adiciona/Atualiza nomes e garante tipos corretos localmente para a DataGrid
      const finalProductData = {
        ...savedOrUpdatedProduct,
         // Usa os nomes buscados
        categoryName: categoryName,
        subcategoryName: subcategoryName,
         // Garante que booleanos e números estejam corretos
        hasTechnicalDetails: !!savedOrUpdatedProduct.technicalDetails && Object.keys(savedOrUpdatedProduct.technicalDetails).length > 0,
        productFrete: !!savedOrUpdatedProduct.productFrete,
        price: savedOrUpdatedProduct.price ?? null, // Garante null se não vier
        productValue: savedOrUpdatedProduct.productValue ?? savedOrUpdatedProduct.price ?? null,
        stockQuantity: savedOrUpdatedProduct.stockQuantity ?? 0,
      };


      // 2. Salvar/Atualizar Detalhes Técnicos (SE NECESSÁRIO)
      // ... (código existente de saveTechnicalDetails, se aplicável) ...


      // 3. Atualizar Estado Local e Fechar Modal
      if (isEditMode) {
          // Atualiza o produto na lista local com os dados processados
          setProducts(
              products.map((product) =>
                  product?.id === productId ? finalProductData : product // Usa os dados processados, com check de 'product'
              )
          );
          alert('Produto atualizado com sucesso!');
          await fetchProducts();
      } else {
          // Adiciona o novo produto (com dados processados) à lista local
          setProducts([...products, finalProductData]);
          alert('Produto adicionado com sucesso!');
      }
      setIsModalOpen(false); // Fecha o modal

  } catch (error) {
      console.error(
          `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto:`,
          error
      );
      alert(
          `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto: ${error.message}. Tente novamente.`
      );
  } finally {
      setIsLoading(false);
      // Considerar um refetch se a atualização local for complexa ou propensa a erros
      // fetchProducts();
  }
};

// Função separada para salvar detalhes técnicos (se a API exigir)
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
      const postToEdit = postsList.find(post => post?.id === selectedPostRowIds[0]); // Check post existence
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
      } else {
        alert('Post selecionado não encontrado ou inválido.');
      }
    } else {
      alert('Por favor, selecione UM post para editar.');
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
        fetch(`https://${API}/posts/${id}`, { // Rota correta para posts
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const results = await Promise.allSettled(deletePromises);
      let successfulDeletes = 0;
      let failedDeletes = 0;

       results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.ok) {
          successfulDeletes++;
        } else {
          failedDeletes++;
          console.error("Falha ao excluir post:", result.reason || result.value?.statusText);
        }
      });


      if (successfulDeletes > 0) {
        setPostsList(
          postsList.filter((post) => post && !selectedPostRowIds.includes(post.id)) // Check post existence
        );
        setSelectedPostRowIds([]);
        alert(`${successfulDeletes} post(s) excluído(s) com sucesso.`);
      }
       if (failedDeletes > 0) {
          alert(`${failedDeletes} post(s) não puderam ser excluídos.`);
       }
       if (successfulDeletes === 0 && failedDeletes === 0) {
            alert('Nenhum post selecionado ou encontrado para exclusão.');
       }

    } catch (error) {
      console.error('Erro ao excluir posts:', error);
      alert('Erro ao excluir posts.');
    } finally {
      setIsLoading(false);
      setIsDeletePostModalOpen(false);
      // fetchPosts(); // Não necessário se a atualização local funcionar
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
     // Limpar form ao fechar (opcional)
     setPostFormData({ title: '', subtitle: '', content: '', imageUrl: '', media: [] });
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
     // Limpar form ao fechar (opcional, mas recomendado)
     setFormData({
        nameProduct: '', price: '', description: '', categoryId: '', subcategoryId: '',
        productModel: '', additionalInfo: '', stockQuantity: 0, technicalDetails: {},
        relatedProductIds: [], productFrete: false,
     });
     setSelectedProduct(null); // Limpa produto selecionado
     setShowTechnicalDetails(false); // Reseta checkbox de detalhes
      setSubcategories([]); // Limpa opções de subcategoria
  };

  // Handler unificado para inputs do formulário principal (formData)
 const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Lógica para Checkbox
    if (type === 'checkbox') {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: checked,
        }));
    // Lógica para Categoria (limpar subcategoria se categoria mudar)
    } else if (name === 'categoryId') {
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: value,
            subcategoryId: '', // Limpa subcategoria ao mudar categoria
        }));
        // A busca de subcategorias é feita pelo useEffect
    // Lógica para campos numéricos (preço, estoque)
    } else if (name === 'price' || name === 'stockQuantity') {
      const cleanValue = value; // Mantém como string por enquanto para permitir digitação
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: cleanValue,
      }));
    // Lógica para outros campos de texto/select simples
    } else {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }
};


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

  // --- Definição das Colunas ---

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'nameProduct',
      headerName: 'Nome do Produto',
      width: 250,
      editable: false,
    },
    {
      field: 'productValue', // Campo principal para preço
      headerName: 'Preço (R$)',
      type: 'number',
      width: 130,
      editable: false,
      // ** CORREÇÃO APLICADA AQUI **
      valueGetter: (params) => params.row ? (params.row.productValue ?? params.row.price ?? null) : null, // Verifica se params.row existe e usa fallback
      valueFormatter: (params) => { // Formatar como moeda
         const value = params;
         if (value == null) { // Trata null/undefined explicitamente
           return '';
         }
         const numberValue = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
         if (isNaN(numberValue)) {
            return ''; // Retorna vazio se não for um número válido
         }
         return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
       },
    },
    { field: 'categoryName', headerName: 'Categoria', width: 150 },
    { field: 'subcategoryName', headerName: 'Subcategoria', width: 150 },
    {
      field: 'stockQuantity',
      headerName: 'Estoque',
      type: 'number',
      width: 100,
      // ** CORREÇÃO APLICADA AQUI **
      valueGetter: (params) => params.row ? (params.row.stockQuantity ?? 0) : 0, // Garante que seja número ou 0, com check de row
    },
    {
      field: 'hasTechnicalDetails',
      headerName: 'Detalhes Técnicos',
      width: 150,
      type: 'boolean',
       // ** ADIÇÃO DE SEGURANÇA ** (Embora menos provável de dar erro aqui)
      valueGetter: (params) => params.row ? !!params.row.hasTechnicalDetails : false,
    },
    {
      field: 'productFrete',
      headerName: 'Frete Automático',
      width: 150,
      type: 'boolean', // Manter o type
      // Remover ou comentar o valueGetter:
      // valueGetter: (params) => params.row ? !!params.row.productFrete : false,
    },
    {
      field: 'productModel',
      headerName: 'Modelo',
      width: 150,
      editable: false,
    },
  ];

  const postColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Título', width: 300 },
    { field: 'subtitle', headerName: 'Subtítulo', width: 300 },
    {
        field: 'createdAt',
        headerName: 'Criado em',
        width: 180,
        type: 'dateTime',
         // ** CORREÇÃO APLICADA AQUI **
        valueGetter: (params) => params.row && params.row.createdAt ? new Date(params.row.createdAt) : null, // Verifica row e valor
     },
     {
        field: 'updatedAt',
        headerName: 'Atualizado em',
        width: 180,
        type: 'dateTime',
         // ** CORREÇÃO APLICADA AQUI **
        valueGetter: (params) => params.row && params.row.updatedAt ? new Date(params.row.updatedAt) : null, // Verifica row e valor
     },
  ];

  const categoryColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome da Categoria', flex: 1 }, // Usar flex para ocupar espaço restante
  ];

  const subcategoryColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome da Subcategoria', width: 300 },
    { field: 'categoryName', headerName: 'Categoria Pai', flex: 1 }, // Mostrar nome da categoria pai
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
      const categoryToEdit = categoriesList.find(cat => cat?.id === selectedCategoryRowIds[0]); // Check cat existence
      if (categoryToEdit) {
        setCategoryModalMode('edit');
        setSelectedCategory(categoryToEdit);
        setIsCategoryModalOpen(true);
        setCategoryFormData({ name: categoryToEdit.name });
      } else {
        alert('Categoria selecionada não encontrada ou inválida.');
      }
    } else {
      alert('Selecione UMA categoria para editar.');
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

     if (!categoryFormData.name) {
        alert("O nome da categoria é obrigatório.");
        setIsLoading(false);
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
        const savedOrUpdatedCategory = await response.json();
        if (isEditMode) {
          // Atualiza a categoria nas listas locais
          const updateList = (list) => list.map((cat) =>
                cat?.id === savedOrUpdatedCategory.id ? savedOrUpdatedCategory : cat // Check cat existence
            );
          setCategoriesList(updateList);
          setCategories(updateList);
          alert('Categoria atualizada com sucesso!');
        } else {
          // Adiciona a nova categoria nas listas locais
           setCategoriesList(prev => [...prev, savedOrUpdatedCategory]);
           setCategories(prev => [...prev, savedOrUpdatedCategory]);
          alert('Categoria adicionada com sucesso!');
        }
        setIsCategoryModalOpen(false);
        // A atualização das subcategorias que usam categoryName será feita pelo useEffect [categoriesList]
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} categoria: ${error.message}. Tente novamente.`
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
       setIsLoading(false);
      return;
    }

    // Validação prévia (idealmente via API, mas fazemos uma básica aqui)
     const categoriesToDelete = categoriesList.filter(cat => cat && selectedCategoryRowIds.includes(cat.id)); // Check cat existence
     const associatedSubcats = subcategoriesList.filter(sub => sub && selectedCategoryRowIds.includes(sub.categoryId));
     const associatedProducts = products.filter(prod => prod && selectedCategoryRowIds.includes(prod.categoryId));

     if (associatedSubcats.length > 0 || associatedProducts.length > 0) {
         alert(`Não é possível excluir categorias pois existem ${associatedSubcats.length} subcategorias e/ou ${associatedProducts.length} produtos associados.`);
         setIsLoading(false);
         setIsDeleteCategoryModalOpen(false); // Fecha o modal de confirmação
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
      let successfulDeletes = 0;
      let failedDeletes = 0;

       results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.ok) {
          successfulDeletes++;
        } else {
          failedDeletes++;
           const status = result.value?.status;
           let reason = result.reason?.message || 'Erro desconhecido';
           if (status === 400 || status === 409) { // Conflict or Bad Request
               reason = "Falha ao excluir. Verifique se há associações (subcategorias/produtos).";
           }
           console.error(`Falha ao excluir categoria ID ${result.value?.url?.split('/').pop()}: ${status} - ${reason}`);
        }
      });


      if (successfulDeletes > 0) {
          // Atualiza ambas as listas de categorias
         const filterDeleted = (list) => list.filter((cat) => cat && !selectedCategoryRowIds.includes(cat.id)); // Check cat existence
         setCategoriesList(filterDeleted);
         setCategories(filterDeleted);
         setSelectedCategoryRowIds([]);
         alert(`${successfulDeletes} categoria(s) excluída(s) com sucesso.`);
      }
      if (failedDeletes > 0) {
          alert(`${failedDeletes} categoria(s) não puderam ser excluída(s). Verifique o console ou se existem associações.`);
      }
      if(successfulDeletes === 0 && failedDeletes === 0) {
            alert('Nenhuma categoria selecionada ou encontrada para exclusão.');
      }
    } catch (error) {
      console.error('Erro ao excluir categorias:', error);
      alert('Erro ao excluir categorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteCategoryModalOpen(false);
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
    setCategoryFormData({ name: '' }); // Limpa form
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
          required // Marcar como obrigatório
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
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Categoria'}
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
      const subcategoryToEdit = subcategoriesList.find(sub => sub?.id === selectedSubcategoryRowIds[0]); // Check sub existence
      if (subcategoryToEdit) {
        setSubcategoryModalMode('edit');
        setSelectedSubcategory(subcategoryToEdit);
        setIsSubcategoryModalOpen(true);
        setSubcategoryFormData({ name: subcategoryToEdit.name, categoryId: subcategoryToEdit.categoryId });
      } else {
         alert('Subcategoria selecionada não encontrada ou inválida.');
      }
    } else {
      alert('Selecione UMA subcategoria para editar.');
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

     if (!subcategoryFormData.name || !subcategoryFormData.categoryId) {
        alert("Nome da Subcategoria e Categoria Pai são obrigatórios.");
        setIsLoading(false);
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
        const savedOrUpdatedSubcategory = await response.json();
         // Adiciona/Atualiza nome da categoria pai para exibição na tabela
         const parentCategoryName = categoriesList.find(c => c.id === savedOrUpdatedSubcategory.categoryId)?.name || 'N/A';
         const subcategoryWithParentName = { ...savedOrUpdatedSubcategory, categoryName: parentCategoryName };

        if (isEditMode) {
          setSubcategoriesList(
            subcategoriesList.map((sub) =>
              sub?.id === savedOrUpdatedSubcategory.id ? subcategoryWithParentName : sub // Check sub existence
            )
          );
          alert('Subcategoria atualizada com sucesso!');
        } else {
          setSubcategoriesList(prev => [...prev, subcategoryWithParentName]);
          alert('Subcategoria adicionada com sucesso!');
        }
        setIsSubcategoryModalOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        alert(
          `Falha ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria:`,
        error
      );
      alert(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} subcategoria: ${error.message}. Tente novamente.`
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
       setIsLoading(false);
      return;
    }

     // Validação prévia (idealmente via API, mas fazemos uma básica aqui)
      const associatedProducts = products.filter(prod => prod && selectedSubcategoryRowIds.includes(prod.subcategoryId)); // Check prod existence
      if (associatedProducts.length > 0) {
          alert(`Não é possível excluir subcategorias pois existem ${associatedProducts.length} produtos associados.`);
          setIsLoading(false);
          setIsDeleteSubcategoryModalOpen(false); // Fecha o modal
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
       let successfulDeletes = 0;
       let failedDeletes = 0;

       results.forEach(result => {
           if (result.status === 'fulfilled' && result.value.ok) {
               successfulDeletes++;
           } else {
               failedDeletes++;
               const status = result.value?.status;
               let reason = result.reason?.message || 'Erro desconhecido';
               if (status === 400 || status === 409) { // Conflict or Bad Request
                   reason = "Falha ao excluir. Verifique se há produtos associados.";
               }
                console.error(`Falha ao excluir subcategoria ID ${result.value?.url?.split('/').pop()}: ${status} - ${reason}`);
           }
       });


      if (successfulDeletes > 0) {
        setSubcategoriesList(
          subcategoriesList.filter((sub) => sub && !selectedSubcategoryRowIds.includes(sub.id)) // Check sub existence
        );
        setSelectedSubcategoryRowIds([]);
        alert(`${successfulDeletes} subcategoria(s) excluída(s) com sucesso.`);
      }
       if (failedDeletes > 0) {
           alert(`${failedDeletes} subcategoria(s) não puderam ser excluída(s). Verifique o console ou se existem associações.`);
       }
       if(successfulDeletes === 0 && failedDeletes === 0) {
           alert('Nenhuma subcategoria selecionada ou encontrada para exclusão.');
       }
    } catch (error) {
      console.error('Erro ao excluir subcategorias:', error);
      alert('Erro ao excluir subcategorias.');
    } finally {
      setIsLoading(false);
      setIsDeleteSubcategoryModalOpen(false);
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
     setSubcategoryFormData({ name: '', categoryId: '' }); // Limpa form
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
          required
          fullWidth
          label="Nome da Subcategoria"
          name="name"
          value={subcategoryFormData.name}
          onChange={handleSubcategoryInputChange}
        />
        <FormControl fullWidth margin="normal" required>
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
              <em>Selecione...</em>
            </MenuItem>
            {/* Usar categoriesList que é a lista completa para o select */}
            {categoriesList.map((category) => (
              category && // Verifica se categoria existe
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
          disabled={isLoading}
        >
         {isLoading ? 'Salvando...' : 'Salvar Subcategoria'}
        </Button>
      </Box>
    </Modal>
  );


  // Função para renderizar o formulário de post
  const renderPostForm = () => (
    <Modal
      open={isPostModalOpen}
      onClose={handleClosePostModal}
      aria-labelledby="post-modal-title" // Corrigido aria-labelledby
      aria-describedby="post-modal-description" // Corrigido aria-describedby
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
          onClick={handleClosePostModal}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="post-modal-title" variant="h6" component="h2">
          {postModalMode === 'add' ? 'Adicionar Post' : 'Editar Post'}
        </Typography>
        <TextField
          margin="normal"
          required
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
          required
          fullWidth
          label="Conteúdo do Post"
          multiline
          rows={8}
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
          helperText="URL completa da imagem (ex: https://.../imagem.jpg)"
        />

        {/* Adicionar mais campos se necessário (ex: tags, autor, etc.) */}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePost}
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Post'}
        </Button>
      </Box>
    </Modal>
  );


  // useEffect para garantir que categoryName em subcategoriesList seja atualizado quando categoriesList mudar
  useEffect(() => {
    // Apenas executa se ambas as listas tiverem dados para evitar processamento desnecessário
    if (categoriesList.length > 0 && subcategoriesList.length > 0) {
        let changed = false; // Flag para verificar se algo realmente mudou
        const updatedSubList = subcategoriesList.map(sub => {
            if (!sub) return sub; // Ignora entradas nulas/inválidas
            const parentCategory = categoriesList.find(c => c?.id === sub.categoryId); // Check categoria
            const newCategoryName = parentCategory?.name || 'N/A';
            if (sub.categoryName !== newCategoryName) {
                changed = true;
                return { ...sub, categoryName: newCategoryName };
            }
            return sub;
        });

        // Só atualiza o estado se houve mudança para evitar loop infinito
        if (changed) {
            setSubcategoriesList(updatedSubList);
        }
    }
  }, [categoriesList]); // Depende apenas de categoriesList


  return (
    <Box sx={{ p: 4, pt: isMobile ? '85px' : '113px', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Typography variant="h4" gutterBottom>
        Painel de Administração
      </Typography>

      {/* Barra de Navegação entre Seções */}
       <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
         <Grid container spacing={0} justifyContent="center"> {/* Ajuste espaçamento e alinhamento */}
           <Grid item xs={12} sm="auto"> {/* Auto-ajuste em telas maiores */}
             <Button
               variant={selectedPage === 'products' ? 'contained' : 'text'}
               onClick={() => setSelectedPage('products')}
               sx={{ borderRadius: 0, padding: '10px 20px' }} // Estilo de Tab
             >
               Produtos
             </Button>
           </Grid>
           <Grid item xs={12} sm="auto">
             <Button
               variant={selectedPage === 'posts' ? 'contained' : 'text'}
               onClick={() => setSelectedPage('posts')}
               sx={{ borderRadius: 0, padding: '10px 20px' }}
             >
               Posts
             </Button>
           </Grid>
           <Grid item xs={12} sm="auto">
             <Button
               variant={selectedPage === 'hero' ? 'contained' : 'text'}
               onClick={() => setSelectedPage('hero')}
                sx={{ borderRadius: 0, padding: '10px 20px' }}
             >
               Hero Section
             </Button>
           </Grid>
           <Grid item xs={12} sm="auto">
             <Button
               variant={selectedPage === 'categories' ? 'contained' : 'text'}
               onClick={() => setSelectedPage('categories')}
               sx={{ borderRadius: 0, padding: '10px 20px' }}
             >
               Categorias
             </Button>
           </Grid>
           <Grid item xs={12} sm="auto">
             <Button
               variant={selectedPage === 'subcategories' ? 'contained' : 'text'}
               onClick={() => setSelectedPage('subcategories')}
               sx={{ borderRadius: 0, padding: '10px 20px' }}
             >
               Subcategorias
             </Button>
           </Grid>
         </Grid>
       </Box>

      {/* Conteúdo das seções */}

        {/* Seção de Produtos */}
        {selectedPage === 'products' && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap', // Permite quebrar linha em telas pequenas
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                gap: 2, // Espaçamento entre grupos de botões
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5 }}> {/* Diminuir gap */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small" // Botões menores
                  startIcon={<AddIcon />}
                  onClick={handleAddProduct}
                  disabled={isLoading} // Desabilita durante carregamento
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditProduct}
                  disabled={selectedRowIds.length !== 1 || isLoading} // Desabilita se não houver 1 selecionado ou durante carregamento
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteModal}
                disabled={selectedRowIds.length === 0 || isLoading} // Desabilita se nada selecionado ou carregando
                title="Excluir Selecionados" // Adicionar tooltip
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}> {/* Aumentar altura */}
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSizeOptions={[10, 25, 50]} // Opções de tamanho de página
                 initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }, // Define página inicial
                 }}
                checkboxSelection
                disableRowSelectionOnClick={true}
                getRowId={(row) => row.id} // Garante que o ID é usado
                onRowSelectionModelChange={(ids) => {
                  setSelectedRowIds(ids);
                }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                density="compact" // Tabela mais compacta
                loading={isLoading} // Mostra indicador de carregamento na tabela
                 // Opcional: Adicionar tratamento para linhas nulas/inválidas, se necessário
                 // filterModel={{ items: products.map(p => p != null) }} // Exemplo, pode precisar de ajuste
              />
            </Box>
            {renderProductForm()}
          </>
        )}

         {/* Seção de Posts */}
        {selectedPage === 'posts' && (
          <>
             <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddPost}
                   disabled={isLoading}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditPost}
                  disabled={selectedPostRowIds.length !== 1 || isLoading}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeletePostModal}
                disabled={selectedPostRowIds.length === 0 || isLoading}
                title="Excluir Selecionados"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
             <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={postsList}
                columns={postColumns}
                pageSizeOptions={[10, 25, 50]}
                 initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                 }}
                 autoHeight={false} // Usar altura fixa definida no Box pai
                 checkboxSelection
                 disableRowSelectionOnClick={true}
                 getRowId={(row) => row.id} // Garante ID
                 onRowSelectionModelChange={(ids) => {
                  setSelectedPostRowIds(ids);
                 }}
                 localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 density="compact"
                 loading={isLoading}
              />
            </Box>
            {renderPostForm()}
          </>
        )}

         {/* Seção de Categorias */}
        {selectedPage === 'categories' && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                gap: 2,
              }}
            >
               <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                   disabled={isLoading}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditCategory}
                  disabled={selectedCategoryRowIds.length !== 1 || isLoading}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteCategoryModal}
                disabled={selectedCategoryRowIds.length === 0 || isLoading}
                 title="Excluir Selecionadas"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={categoriesList}
                columns={categoryColumns}
                pageSizeOptions={[10, 25, 50]}
                 initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                 }}
                 autoHeight={false}
                 checkboxSelection
                 disableRowSelectionOnClick={true}
                 getRowId={(row) => row.id} // Garante ID
                 onRowSelectionModelChange={(ids) => {
                  setSelectedCategoryRowIds(ids);
                 }}
                 localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 density="compact"
                 loading={isLoading}
              />
            </Box>
            {renderCategoryForm()}
          </>
        )}

         {/* Seção de Subcategorias */}
        {selectedPage === 'subcategories' && (
          <>
             <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                gap: 2,
              }}
            >
               <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddSubcategory}
                   disabled={isLoading}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditSubcategory}
                  disabled={selectedSubcategoryRowIds.length !== 1 || isLoading}
                >
                  Editar
                </Button>
              </Box>
              <IconButton
                color="error"
                onClick={handleOpenDeleteSubcategoryModal}
                disabled={selectedSubcategoryRowIds.length === 0 || isLoading}
                title="Excluir Selecionadas"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={subcategoriesList}
                columns={subcategoryColumns}
                pageSizeOptions={[10, 25, 50]}
                 initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                 }}
                 autoHeight={false}
                 checkboxSelection
                 disableRowSelectionOnClick={true}
                 getRowId={(row) => row.id} // Garante ID
                 onRowSelectionModelChange={(ids) => {
                  setSelectedSubcategoryRowIds(ids);
                 }}
                 localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                 density="compact"
                 loading={isLoading}
              />
            </Box>
            {renderSubcategoryForm()}
          </>
        )}

         {/* Seção Hero Section */}
         {selectedPage === 'hero' && (
            <>
                <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2,
                    gap: 2,
                }}
                >
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenHeroModal('add')}
                     disabled={isLoading}
                    >
                    Adicionar
                    </Button>
                    <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                        if (selectedHeroRowIds.length === 1) {
                        const heroToEdit = heroSections.find(
                            (hs) => hs?.id === selectedHeroRowIds[0] // Check hs existence
                        );
                        if (heroToEdit) { // Verifica se encontrou antes de abrir
                            handleOpenHeroModal('edit', heroToEdit);
                        } else {
                             alert('Hero Section selecionada não encontrada ou inválida.');
                        }
                        } else {
                        alert('Por favor, selecione UMA Hero Section para editar.');
                        }
                    }}
                    disabled={selectedHeroRowIds.length !== 1 || isLoading}
                    >
                    Editar
                    </Button>
                </Box>
                <IconButton
                    color="error"
                    onClick={handleOpenDeleteHeroModal}
                    disabled={selectedHeroRowIds.length === 0 || isLoading}
                     title="Excluir Selecionadas"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
                <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={heroSections}
                    columns={heroSectionColumns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                     autoHeight={false}
                    checkboxSelection
                    disableRowSelectionOnClick={true}
                    getRowId={(row) => row.id} // Garante ID
                    onRowSelectionModelChange={(ids) => {
                    setSelectedHeroRowIds(ids);
                    }}
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    density="compact"
                    loading={isLoading}
                />
                </Box>
                {renderHeroSectionForm()}
                 {/* Modal de Exclusão Hero Section */}
                 <Modal
                    open={isDeleteHeroModalOpen}
                    onClose={handleCloseDeleteHeroModal}
                    aria-labelledby="delete-hero-modal-title"
                    aria-describedby="delete-hero-modal-description"
                 >
                    <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', width: isMobile ? '80%' : 400,
                        bgcolor: 'background.paper', border: '2px solid #000',
                        boxShadow: 24, p: 4,
                    }}
                    >
                    <Typography id="delete-hero-modal-title" variant="h6" component="h2">
                        Confirmação de Exclusão
                    </Typography>
                    <Typography id="delete-hero-modal-description" sx={{ mt: 2 }}>
                        Deseja realmente excluir {selectedHeroRowIds.length} Hero Section(s)?
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleCloseDeleteHeroModal} variant="outlined">
                        Cancelar
                        </Button>
                        <Button
                        onClick={handleDeleteSelectedHeroSections}
                        variant="contained"
                        color="error"
                        disabled={isLoading}
                        >
                        {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
                        </Button>
                    </Box>
                    </Box>
                 </Modal>
            </>
         )}


       {/* --- Modais de Confirmação de Exclusão (Genéricos) --- */}

      {/* Modal Excluir Produto(s) */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '80%' : 400,
            bgcolor: 'background.paper', border: '2px solid #000',
            boxShadow: 24, p: 4,
          }}
        >
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedRowIds.length} produto(s) selecionado(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseDeleteModal} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedProductsAction}
              variant="contained"
              color="error"
              disabled={isLoading}
            >
             {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>

       {/* Modal Excluir Post(s) */}
      <Modal
        open={isDeletePostModalOpen}
        onClose={handleCloseDeletePostModal}
        aria-labelledby="delete-post-modal-title"
        aria-describedby="delete-post-modal-description"
      >
         <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '80%' : 400,
            bgcolor: 'background.paper', border: '2px solid #000',
            boxShadow: 24, p: 4,
          }}
        >
          <Typography id="delete-post-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão
          </Typography>
          <Typography id="delete-post-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedPostRowIds.length} post(s) selecionado(s)?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseDeletePostModal} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedPostsAction}
              variant="contained"
              color="error"
               disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>

       {/* Modal Excluir Categoria(s) */}
      <Modal
        open={isDeleteCategoryModalOpen}
        onClose={handleCloseDeleteCategoryModal}
        aria-labelledby="delete-category-modal-title"
        aria-describedby="delete-category-modal-description"
      >
         <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '80%' : 400,
            bgcolor: 'background.paper', border: '2px solid #000',
            boxShadow: 24, p: 4,
          }}
        >
          <Typography id="delete-category-modal-title" variant="h6" component="h2">
            Confirmação de Exclusão
          </Typography>
          <Typography id="delete-category-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedCategoryRowIds.length} categoria(s) selecionada(s)?
             <br/> <Typography component="span" variant="caption" color="error">Atenção: Isso pode falhar se houver subcategorias ou produtos associados.</Typography>
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseDeleteCategoryModal} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedCategoriesAction}
              variant="contained"
              color="error"
               disabled={isLoading}
            >
               {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>

       {/* Modal Excluir Subcategoria(s) */}
      <Modal
        open={isDeleteSubcategoryModalOpen}
        onClose={handleCloseDeleteSubcategoryModal}
        aria-labelledby="delete-subcategory-modal-title"
        aria-describedby="delete-subcategory-modal-description"
      >
         <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '80%' : 400,
            bgcolor: 'background.paper', border: '2px solid #000',
            boxShadow: 24, p: 4,
          }}
        >
          <Typography id="delete-subcategory-modal-title" variant="h6" component="h2">
             Confirmação de Exclusão
          </Typography>
          <Typography id="delete-subcategory-modal-description" sx={{ mt: 2 }}>
            Deseja realmente excluir {selectedSubcategoryRowIds.length} subcategoria(s) selecionada(s)?
             <br/> <Typography component="span" variant="caption" color="error">Atenção: Isso pode falhar se houver produtos associados.</Typography>
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseDeleteSubcategoryModal} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteSelectedSubcategoriesAction}
              variant="contained"
              color="error"
              disabled={isLoading}
            >
             {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box> // Box principal
  );
};

export default AdminPanel;