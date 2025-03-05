
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AdminBlogControls = ({onAddBlogPost}) => { // Adicione onAddBlogPost como prop
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        onClick={onAddBlogPost} // Utilize a prop onAddBlogPost aqui
        sx={{
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          borderRadius: '8px',
          px: 3,
          py: 1,
        }}
      >
        <Typography
          variant="h6"
          color="white"
          textTransform={'none'}
          fontWeight={'bold'}
        >
          Adicionar Novo Post
        </Typography>
      </Button>
    </Box>
  );
};

export default AdminBlogControls;