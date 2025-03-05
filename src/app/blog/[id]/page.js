// src/app/blog/[id]/page.js

import { Box, Typography, Container, Button, Stack } from '@mui/material';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { API } from '../../configs/general';
import { headers } from 'next/headers';


async function fetchPost(postId) {
  try {
    const response = await fetch(`https://${API}/posts/${postId}`);
    if (!response.ok) {
      if (response.status === 404) {
        // Trata 404 como post não encontrado, sem erro
        return null;
      } else {
        // Outros erros (ex: 500, 503) são tratados como erro
        throw new Error(`Falha ao buscar post: ${response.status} ${response.statusText}`);
      }
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    // Em ambiente de servidor, você pode registrar o erro, mas geralmente não deve lançar
    // para evitar quebrar a renderização da página. Retorne null ou um objeto de erro customizado.
    return { error: error.message };
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Data Desconhecida';
  const date = new Date(dateString);
  return format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR });
}

export async function generateMetadata({ params }) {
  const postId = parseInt(params.id);
  const post = await fetchPost(postId);

  if (!post || post.error) {
    return {
      title: 'Post não encontrado',
      description: 'O post que você está procurando não foi encontrado.',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160), // Use a parte inicial do conteúdo como descrição.
    openGraph: {
      images: [post.imageUrl],
      title: post.title,
      description: post.content.substring(0, 160),
      url: `https://yourdomain.com/blog/${postId}`, // Substitua yourdomain.com pelo seu domínio
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 160),
      images: [post.imageUrl],
    }
  };
}


export default async function BlogPostPage({ params }) {
  const postId = parseInt(params.id);
  const post = await fetchPost(postId);
  const headersList = headers();
  const pathname = headersList.get('next-url');


  if (!post) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Post não encontrado.</Typography>
      </Container>
    );
  }

  if (post.error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Erro ao carregar o post.
        </Typography>
        <Typography variant="body1" color="error">
          {post.error} Por favor, tente novamente mais tarde.
        </Typography>
      </Container>
    );
  }

  const previousPostId = postId > 1 ? postId - 1 : 1;
  const nextPostId = postId + 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, pt: '60px', flexGrow: 1 }}>
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Voltar à Página Principal
          </Button>
        </Link>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="secondary.main">
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {formatDate(post.createdAt)}
          </Typography>
          {post.imageUrl && (
            <Box sx={{ position: 'relative', width: '100%', height: 300, overflow: 'hidden', borderRadius: '8px', mt: 2, mb: 3 }}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Box>
          )}
        </Box>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.secondary', fontSize: '1.1rem' }}>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ node, ...props }) => <p style={{ marginTop: '1em', marginBottom: '1em' }} {...props} />,
              img: ({ node, ...props }) => <img style={{ maxWidth: '100%', height: 'auto' }} {...props} />
            }}
          >
            {post.content}
          </ReactMarkdown>
        </Typography>
      </Container>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 'auto', p: 4 }}
      >
        <Button
          component={Link}
          href={`/blog/${previousPostId}`}
          variant="outlined"
          color="primary"
          disabled={postId <= 1}
          sx={{ textTransform: 'none' }}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          component={Link}
          href={`/blog/${nextPostId}`}
          variant="outlined"
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          <ArrowForwardIcon />
        </Button>
      </Stack>
    </Box>
  );
}