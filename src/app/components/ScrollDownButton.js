'use client';

import { IconButton, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { keyframes } from '@mui/system';

// Define a animação de flutuar
const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const ScrollDownButton = () => {
  const handleScrollDown = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <IconButton
      onClick={handleScrollDown}
      sx={{
        color: 'white',
        marginTop: 4,
        animation: `${floatAnimation} 2s ease-in-out infinite`, // Aplica a animação
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <KeyboardArrowDownIcon fontSize="large" />
        <KeyboardArrowDownIcon fontSize="large" sx={{ marginTop: '-50px' }} /> {/* Segunda seta com margem negativa */}
      </Box>
    </IconButton>
  );
};

export default ScrollDownButton;