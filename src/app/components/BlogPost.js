// src/app/components/BlogPost.js
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
  } from '@mui/material';
import Link from 'next/link'; // Importe Link
import { format } from 'date-fns'; // Importe a função format
import { ptBR } from 'date-fns/locale'; // Importe o locale ptBR para formatar em português
import Head from 'next/head'; // Importe Head do next/head para SEO

const BlogPost = ({ post }) => {

// Função para formatar a data
const formatDate = (dateString) => {
    if (!dateString) return 'Data Desconhecida';
    const date = new Date(dateString);
    return format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR });
};


return (
    <>
    {/* SEO with Next.js Head component */}
    <Head>
        <title>{post.title} | BWR Bombas</title> {/* Title with post title */}
        <meta name="description" content={post.description} /> {/* Description from post */}
        {/* Optionally add more meta tags as needed */}
         <meta property="og:title" content={post.title} />
         <meta property="og:description" content={post.description}/>
         <meta property="og:image" content={post.imageUrl} />
         <meta property="og:type" content="article" />

         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={post.title} />
         <meta name="twitter:description" content={post.description} />
         <meta name="twitter:image" content={post.imageUrl} />

    </Head>

    <Card
    sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        },
    }}
    >
    <CardMedia
        component="img"
        image={post.imageUrl}
        alt={`Imagem para ${post.title}`} //  <--  Melhoria:  Texto alt mais descritivo
        sx={{
        width: '100%',
        height: 200,
        objectFit: 'cover',
        }}
    />
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Link href={`/blog/${post.id}`} passHref>
            {/* Melhoria:  Texto âncora mais descritivo */}
            <Typography
            variant="h5"
            gutterBottom
            // color={theme.palette.secondary.main} // REMOVE
            color="secondary.main" //  <--  Use color directly
            fontWeight={'bold'}
            component="h2" //  <--  Melhoria:  Use tag semântica h2 para o título do post
            sx={{
                mb: 1,
                lineHeight: 1.3,
                transition: 'color 0.3s ease-in-out',
                '&:hover': {
                // color: theme.palette.primary.main // REMOVE
                color: "primary.main" //  <-- Use color directly
                }
            }}
            >
            {post.title}
            </Typography>
        </Link>
        <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" component="time" dateTime={post.createdAt}> {/* Melhoria: use a tag <time> */}
            {formatDate(post.createdAt)} {/* Exibe a data de criação formatada */}
        </Typography>
        </Box>
        <Typography variant="body1" paragraph color="text.secondary" sx={{lineHeight:1.6}} component="p"> {/* Melhoria: use a tag <p> */}
        {post.content.length > 150
            ? `${post.content.substring(0, 150)}...`
            : post.content}
        </Typography>
        <Box sx={{ mt: 2 }}>
        <Link href={`/blog/${post.id}`} passHref>
            <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
                '&:hover': {
                // backgroundColor: theme.palette.primary.main, // REMOVE
                backgroundColor: "primary.main", //  <-- Use color directly
                color: '#fff'
                }
            }}
            >
            Leia Mais sobre {post.title} {/* Melhoria: Texto âncora mais descritivo */}
            </Button>
        </Link>
        </Box>
    </CardContent>
    </Card>
    </>
);
};

export default BlogPost;
