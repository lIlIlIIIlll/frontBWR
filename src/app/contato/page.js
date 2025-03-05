'use client'


// src/app/contato/page.js
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ThemeRegistry from "../components/ThemeRegistry";
import theme from "../configs/theme";
import Image from "next/image"; // Import the Image component
import { API } from "../configs/general"; // Import the API constant


function Contact({ theme }) {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      telefone: formData.get("telefone"),
      mensagem: formData.get("mensagem"),
    };

    try {
      const response = await fetch(`https://${API}/email/send`, { // Use the API constant and http
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Mensagem enviada com sucesso!");
        event.currentTarget.reset(); // Clears the form after successful submission
      } else {
        const errorData = await response.json();
        alert(`Erro ao enviar mensagem: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      alert("Erro ao enviar mensagem: " + error);
    }
  };


  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Banner de Contato */}
      <Box
        sx={{
          backgroundImage: 'url("/contatoBG.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          py: { xs: 8, md: 10 }, // Aumenta o padding vertical no desktop
          mb: { xs: 4, md: 6 }, // Aumenta a margem inferior no desktop
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          fontSize={{ xs: "2.5rem", md: "3.5rem" }} // Aumenta o tamanho da fonte
        >
          Contato
        </Typography>
      </Box>

      {/* Nossos Canais de Contato */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          textAlign: "center",
          py: 6, // Aumenta o padding vertical
          mb: { xs: 4, md: 6 },
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Nossos Canais de Contato
        </Typography>
        <Typography
          variant="body1"
          fontSize={{ xs: "1rem", md: "1.1rem" }}
          sx={{ maxWidth: "800px", mx: "auto", px: 2 }}
        >
          Temos uma equipe pronta para lhe atender e oferecer a melhor solução.
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        mb={{ xs: 4, md: 6 }}
      >
        {/* Card de E-mail */}
        <Grid item xs={12} sm={4}>
          <Link href="mailto:contato@bwr.com.br" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                p: 3,
                borderRadius: 2, // Aumenta o border radius
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              <EmailIcon
                sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }}
              />
              <Typography variant="h6" fontWeight="bold" mb={1}>
                E-mail
              </Typography>
              <Typography variant="body1" fontSize="1.1rem">
                contato@bwr.com.br
              </Typography>
            </Box>
          </Link>
        </Grid>

        {/* Card de Telefone */}
        <Grid item xs={12} sm={4}>
          <Link href="https://wa.me/551144564595" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                p: 3,
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 60, mb: 2, color: "#25d366" }} />
              <Typography variant="h6" fontWeight="bold" mb={1}>
                WhatsApp
              </Typography>
              <Typography variant="body1" fontSize="1.1rem">
                (11) 4456-4595 / 4456-4598
              </Typography>
            </Box>
          </Link>
        </Grid>

        {/* Card de Horário */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: theme.palette.secondary.main,
              color: "white",
              p: 3,
              borderRadius: 2,
              transition: "0.3s",
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            <AccessTimeIcon
              sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }}
            />
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Horário
            </Typography>
            <Typography variant="body1" fontSize="1.1rem">
              Das 9h às 18h
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Seção de Endereço */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        mb={{ xs: 4, md: 6 }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              pl: { md: 4 },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              color={theme.palette.primary.main}
            >
              Endereço
            </Typography>
            <Typography variant="body1" mb={1} fontSize="1.1rem">
              R. Santa Rosália, 851 -
            </Typography>
            <Typography variant="body1" mb={2} fontSize="1.1rem">
              Jardim Sao Gabriel, Salto - SP, 13327-370
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Link href="https://www.facebook.com/BWRBombas/" >
                <IconButton color="primary" sx={{
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}>
                  <FacebookIcon />
                </IconButton>
              </Link>
              <Link href="#" >
                <IconButton color="primary" sx={{
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}>
                  <InstagramIcon />
                </IconButton>
              </Link>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: { xs: "300px", md: "450px" },
              border: "1px solid lightgrey",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143758.52642011413!2d-47.39055042640274!3d-23.091787583555394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf526cb89e6eed%3A0xe3b84f15c4f686cf!2sBWR%20-%20Bombas%2C%20Servi%C3%A7os%20e%20Com%C3%A9rcio%20LTDA!5e0!3m2!1spt-BR!2sbr!4v1736660879706!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da BWR Bombas"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Formulário de Contato */}
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: "white",
          textAlign: "center",
          py: 6,
          mb: { xs: 2, md: 0 }
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Fale Conosco
        </Typography>
        <Typography variant="h5" fontWeight="bold" mb={{ xs: 2, md: 4 }}>
          Entre em Contato
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit} // Add the submit handler
          sx={{
            width: { xs: "90%", md: "50%" },
            mx: "auto",
            mt: 4,
            p: 2,
          }}
        >
          <TextField
            fullWidth
            label="Nome"
            variant="filled"
            margin="normal"
            name="nome" // Add name attribute
            InputLabelProps={{
              style: { color: theme.palette.primary.main }, // Cor do label
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: theme.palette.primary.main, // Cor da borda inferior antes de focar
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: theme.palette.primary.main, // Cor da borda inferior após focar
              },
            }}
          />
          <TextField
            fullWidth
            label="E-mail"
            variant="filled"
            margin="normal"
            name="email" // Add name attribute
            InputLabelProps={{
              style: { color: theme.palette.primary.main },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: theme.palette.primary.main,
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: theme.palette.primary.main,
              },
            }}
          />
          <TextField
            fullWidth
            label="Telefone"
            variant="filled"
            margin="normal"
            name="telefone" // Add name attribute
            InputLabelProps={{
              style: { color: theme.palette.primary.main },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: theme.palette.primary.main,
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: theme.palette.primary.main,
              },
            }}
          />
          <TextField
            fullWidth
            label="Mensagem"
            variant="filled"
            multiline
            rows={4}
            margin="normal"
            name="mensagem" // Add name attribute
            InputLabelProps={{
              style: { color: theme.palette.primary.main },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: theme.palette.primary.main,
              },
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: theme.palette.primary.main,
              },
            }}
          />
          <Button
            type="submit" // Set the button type to submit
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 2,
              transition: "0.3s",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function ContactPage() {
  return (
    <ThemeRegistry>
      <Contact theme={theme} />
    </ThemeRegistry>
  )
}