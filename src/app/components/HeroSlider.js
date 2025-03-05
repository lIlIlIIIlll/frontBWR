// src/app/components/HeroSlider.js
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@mui/material/styles";
import { API } from '../configs/general.js'; // Import the API constant
import Link from 'next/link';


const HeroSlider = () => {
  const theme = useTheme();

  const [currentHero, setCurrentHero] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [heroes, setHeroes] = useState([]); // Store fetched hero sections

  const fetchHeroSections = async () => {
    try {
      const response = await fetch(`https://${API}/herosection`);
      if (response.ok) {
        const data = await response.json();
        setHeroes(data);
      } else {
        console.error('Failed to fetch hero sections:', response.statusText);
        // Handle error appropriately, maybe set a default hero section
        setHeroes([]); // Or set a default hero
      }
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      // Handle error, set default hero
      setHeroes([]); // Or set a default hero
    }
  };

  useEffect(() => {
    fetchHeroSections();
  }, []);


  useEffect(() => {
    if (heroes.length > 0) { // Only set up the timer if there are heroes
        const timer = setInterval(() => {
          setCurrentHero((prevHero) => (prevHero + 1) % heroes.length);
        }, 5000); // Muda o hero a cada 5 segundos

        return () => clearInterval(timer);
    }
  }, [heroes.length]);

  const handleNext = () => {
    setCurrentHero((prevHero) => (prevHero + 1) % heroes.length);
  };

  const handlePrevious = () => {
    setCurrentHero((prevHero) => (prevHero - 1 + heroes.length) % heroes.length);
  };

  const handleCloseHero = () => {
    setIsHeroVisible(false);
  };

  if (!isHeroVisible || heroes.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '400px', // Ajuste a altura conforme necessário
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.main
      }}
    >
      {heroes.map((hero, index) => (
        <Box
          key={hero.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: hero.imageUrl ? '':theme.palette.primary.main,
            backgroundImage: hero.imageUrl && `url(${hero.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentHero ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // color: 'white',  // REMOVE this line
            textAlign: 'center',
            py: 5,
          }}
        >
         {hero.title && (<Typography variant="h3" gutterBottom style={{ color: hero.colorText, fontWeight:100 }}>
            {hero.title}
          </Typography>)}
          {hero.subtitle && (<Typography variant="h6" gutterBottom style={{ color: hero.colorText, fontWeight:100 }}>
            {hero.subtitle}
          </Typography>)}

          {hero.buttonText &&(
          <Link href={hero.buttonLink || '#'} passHref>
            <Button variant="contained" color="secondary" size="large">
              {hero.buttonText}
            </Button>
          </Link>
          )}
        </Box>
      ))}

      <IconButton
        onClick={handleCloseHero}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 3,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>

      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '16px',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <ChevronLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '16px',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <ChevronRightIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default HeroSlider;