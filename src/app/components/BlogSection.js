// src/app/components/BlogSection.js
"use client"; //  <--  IMPORTANTE:  Marca este componente como Client Component

import { Box, Typography, CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import BlogPost from './BlogPost';

export default function BlogSection({ postsList }) {
  const loadingPosts = false; //  Você pode remover isso se já estiver lidando com o loading no componente pai

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{
      width: '100%',
      padding: { xs: 2, md: 4 },
      pt: { xs: '80px', md: '88px' },
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        // color={theme.palette.primary.main} // REMOVE
        color="primary.main"
        fontWeight="bold"
        sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', mb: 4 }}
      >
        Blog da BWR Bombas
      </Typography>
      {loadingPosts ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : postsList.length > 1 ? (
        <Slider {...settings}>
          {postsList.map((post) => (
            <Box key={post.id} sx={{ p: 1 }}>
              <BlogPost post={post} />
            </Box>
          ))}
        </Slider>
      ) : postsList.length === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <BlogPost post={postsList[0]} />
        </Box>
      ) : (
        <Typography variant="body1" align="center" color="textSecondary">
          Em breve, novidades no nosso blog!
        </Typography>
      )}
    </Box>
  );
}