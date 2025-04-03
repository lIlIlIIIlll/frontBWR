import React from "react";
import { Box, Typography, IconButton, Link, Grid } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';


function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#1c355d",
        color: "white",
        textAlign: "center",
        py: 4, // Increased padding for more space
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          {/* Logo (Placeholder) */}
          <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }  }}>
                <span style={{color: 'red', marginRight: '4px'}}>Via</span>
                <span style={{ marginRight: '4px'}}>Pet</span>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA9klEQVRIS+2VMRKCMBBFj4w/kETQAjSAlhAX4AbEBRgJyQk4gJbQMjKBLSA/6l86g/W+ffamTZqmaZz7h/gNfxhruAm8AV8DReAP+AZ+BRuFzPzK4qI+AI2gVf4u6k6zfiErwL1kG8Kx35uQ5/5gG2Hq5VzYkGI8L+3LgLzAf7C1WwHjwKx1V3h8h9c/X9eU8A+5RwqMvG+W9+K/zM7f1c1wLwFh3xZdgBXIU36mJjLxlf7xHhL+k4hJ9S0E0b4hL+G+z5w9D5l/W4D2k7HkP2Y/23+08K1tL/l3jJ8o7p+C28Avw7O1tL58AX8DHW8o7l/0B7kF7t5bHywAAAABJRU5ErkJggg==" alt="Via Pet Paw Icon" style={{marginLeft: '4px'}}/>
                
            </Typography>

            <Typography variant="body2">
              Transformando a gestão de petshops com tecnologia e inovação.
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: {xs: 'center', md: 'flex-start'}  }}>
            <IconButton color="inherit" size="small" component={Link} href="#" sx={{ mx: 0.5 }}>
                <FacebookIcon />
            </IconButton>
             <IconButton color="inherit" size="small" component={Link} href="#" sx={{ mx: 0.5 }}>
                <InstagramIcon />
            </IconButton>
            <IconButton color="inherit" size="small" component={Link} href="#" sx={{ mx: 0.5 }}>
                <LinkedInIcon/>
            </IconButton>
            <IconButton color="inherit" size="small" component={Link} href="#" sx={{ mx: 0.5 }}>
                 <YouTubeIcon />
            </IconButton>

          </Box>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>Produto</Typography>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Recursos</Link>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Planos</Link>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Depoimentos</Link>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>Empresa</Typography>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Sobre nós</Link>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Contato</Link>
          <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, textDecoration: 'none' }}>Blog</Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>Contato</Typography>
          <Typography variant="body2" display="block" sx={{ mb: 0.5 }}>
            <span style={{marginRight: '5px'}}>✉</span>
            contato@viapet.com.br
          </Typography>
          <Typography variant="body2" display="block" sx={{ mb: 0.5 }}>
           <span style={{marginRight: '5px'}}>📞</span>
            (11) 99999-9999
          </Typography>
          <Typography variant="body2" display="block" sx={{ mb: 0.5 }}>
            <span style={{marginRight: '5px'}}>📍</span>
            São Paulo, SP
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6} sx={{textAlign: {xs: 'center', md: 'left'}}}>
            <Typography variant="body2">
              Desenvolvido com ❤️ por <Link href="#" color="inherit" sx={{textDecoration: 'none'}}>Patrick.Developer</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'center' } }}>
            <Typography variant="body2">
              © 2025 Via Pet. Todos os direitos reservados.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;