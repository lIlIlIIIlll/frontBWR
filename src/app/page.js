import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import backgroundLP from '../../public/backgroundLP.jpg';
import backgroundBWR from '../../public/background.png';
import ScrollDownButton from './components/ScrollDownButton';
import theme from './configs/theme';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BlogPost from './components/BlogPost';
import { API } from './configs/general'; // Importe a constante API
import BlogSection from './components/BlogSection';


// Metadata for SEO
export const metadata = {
  title: 'BWR Bombas - Bombas de Alta Pressão, Manutenção e Serviços',
  description: 'Especialistas em bombas de alta pressão, centrífugas e de vácuo.  Manutenção, reforma e venda com mais de 25 anos de experiência.  Soluções personalizadas para saneamento e mais.  Entre em contato para consultoria e suporte técnico.',
  keywords: ['bombas de alta pressão', 'bombas centrífugas', 'bombas de vácuo', 'manutenção de bombas', 'reforma de bombas', 'BWR Bombas', 'saneamento', 'serviços de bombeamento', 'bombas industriais', 'soluções de bombeamento'],
  openGraph: {
    title: 'BWR Bombas - Soluções em Bombas de Alta Pressão',
    description: 'Mais de 25 anos de experiência em manutenção, reforma e venda de bombas de alta pressão, centrífugas e de vácuo.  Atendimento especializado e soluções personalizadas.',
    url: 'https://www.bwrbombas.com.br', // Replace with your actual domain
    siteName: 'BWR Bombas',
    images: [
      {
        url: '/backgroundLP.jpg', //  Full URL to your image.  Use a high-quality image.
        width: 1920,
        height: 1080,
        alt: 'Bombas de Alta Pressão',
      },
      {
        url: '/SMimg.png',
        width: 800,
        height: 600,
        alt: 'Serviços da BWR Bombas',
      }
    ],
    locale: 'pt-BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BWR Bombas - Especialistas em Bombas de Alta Pressão',
    description: 'Serviços completos de manutenção, reforma e venda de bombas.  Soluções para diversas aplicações industriais e de saneamento.',
    images: ['/backgroundLP.jpg'], //  Full URL to your image
  },
};


// Fetch posts at build time
async function getPosts() {
  try {
    const res = await fetch(`http://${API}/posts`);
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    // Return an empty array or a default value in case of error
    return [];
  }
}


export default async function Home() {  //  Make the component async
  // const [postsList, setPostsList] = useState([]); -- REMOVE
  // const [loadingPosts, setLoadingPosts] = useState(true); -- REMOVE

  // Fetch posts during build
  const postsList = await getPosts();
  const loadingPosts = false; //  No longer needed, always false after build

  // Configurações do Slider
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

  // useEffect(() => {  -- REMOVE ENTIRE useEffect HOOK
  //   const fetchPosts = async () => {
  //     setLoadingPosts(true); // Inicia o loading
  //     try:
  //       const response = await fetch(`http://${API}/posts`); // Use a constante API aqui
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setPostsList(data);
  //     } catch (error) {
  //       console.error("Erro ao buscar posts:", error);
  //       // Aqui você pode adicionar um estado de erro para mostrar uma mensagem ao usuário
  //     } finally {
  //       setLoadingPosts(false); // Finaliza o loading, independentemente do resultado
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Seção do Banner */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: { xs: '548px', md: '755px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={backgroundLP}
          alt="Banner Image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            width: { xs: '100%', md: '33%' },
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            padding: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              fontFamily: 'Arial Black',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              textAlign: 'center',
              zIndex: 1,
              padding: { xs: 1, md: 0 },
            }}
          >
            Bombas de Alta Pressão
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#194d80',
              color: 'white',
              padding: { xs: '8px 15px', md: '10px 20px' },
              fontSize: { xs: '1rem', md: '1.2rem' },
              '&:hover': {
                backgroundColor: '#194d80',
                opacity: 0.9,
              },
            }}
            href="/contato" // Use next/link for internal links
          >
            Contato
          </Button>
          <ScrollDownButton />
        </Box>
      </Box>

      {/* Seção Sobre a BWR */}
      <Box
        id="next-section"
        sx={{
          width: '100%',
          minHeight: '35rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 2, md: 4 },
          padding: { xs: 4, md: 8 },
          color: theme.palette.text.secondary || 'black',
          backgroundImage: `url(${backgroundBWR.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Container para Imagem e Bloco de Texto */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 2, md: 4 },
            width: '100%',
            position: 'relative',
          }}
        >
          <Box // Changed from Stack to Box for more general layout control
            sx={{
              width: { xs: '100%', md: '50%' },
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            {/* Título "Nossa Empresa" */}
            <Typography
              variant="h2"
              sx={{
                color: "#7f7f7f",
                fontSize: { xs: '1.5rem', md: '1.2rem' },
                marginBottom: 1,
                textAlign: 'left',
                width: '100%',
                marginLeft: { xs: 0, md: '10px' },
              }}
            >
              Nossa Empresa
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', md: '1.4rem' },
                marginBottom: 4,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                width: { xs: 'auto', md: '26%' },
                textAlign: 'center',
              }}
            >
              Sobre a BWR
            </Typography>

            <Box
              sx={{
                color: 'black',
                padding: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 2,
                textAlign: 'left',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Com mais de 25 anos de experiência, a BWR Bombas se destaca na
                manutenção, reforma e venda de bombas de alta pressão, centrífugas
                e de vácuo. Nossa equipe especializada oferece soluções
                personalizadas que garantem a eficiência e satisfação dos
                clientes, com suporte técnico e consultoria desde a escolha até a
                operação dos equipamentos.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Atuamos com manutenções e reformas de bombas de diversas marcas,
                além de oferecer atendimento técnico remoto e presencial, quando
                necessário. Com estrutura moderna e conhecimento técnico,
                garantimos um serviço ágil e eficaz para resolver qualquer
                problema de bombeamento.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Precisa de manutenção ou consultoria? Entre em contato e descreva
                seu problema. Estamos prontos para fornecer a solução ideal para
                você!
              </Typography>
            </Box>
          </Box>

          {/* Imagem (visível apenas em telas maiores que 'sm') */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: { md: '40%' },
              height: { md: '35rem' },
              position: { md: 'absolute' },
              right: 0,
              top: 0,
            }}
          >
            <Image
              src={'/SMimg.png'}
              alt="Imagem Sobre a BWR"
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Box>

        {/*  "A força por trás de nossas soluções" */}
        <Box // Changed from Stack to Box
          sx={{
            width: '100%',
            marginTop: { xs: 2, md: 6 },
            marginBottom: { xs: 2, md: 4 },
            padding: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#7f7f7f',
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              textAlign: 'center',
              width: '100%',
            }}
          >
            A força por trás de nossas soluções
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.3rem', md: '2rem' },
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                width: { xs: 'auto', md: '25%' },
                textAlign: 'center',
                marginTop: 1,
                marginBottom: 2,
              }}
            >
              Nossos Serviços
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', md: '1rem' },
              textAlign: 'center',
              fontWeight: '600',
              width: '100%',
              color: '#7f7f7f',
              textTransform: 'uppercase',
            }}
          >
            Manutenção de Bombas - Reformas Especializadas - Soluções em
            Saneamento
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.8rem', md: '1.2rem' },
              textAlign: 'center',
              width: '100%',
              color: '#7f7f7f',
            }}
          >
            Bombas, Serviços e Comércio
          </Typography>
        </Box>
      </Box>

      {/* Seção "Entre em Contato" */}
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          color: 'white',
          padding: { xs: 3, md: 8 },
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          marginTop: { xs: 4, md: 8 },
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/016/586/639/small_2x/abstract-gray-futuristic-pattern-for-banner-frame-png.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
            width: { xs: '100%', md: 'auto' },
            marginLeft: { xs: 0, md: 2 }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontSize: { xs: '1.8rem', md: '1.83rem' },
              marginBottom: 1,
              textAlign: 'left',
              width: '100%',
              marginLeft: { xs: 0, md: '10px' },
            }}
          >
            Entre em
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              marginBottom: 4,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              width: 'auto',
            }}
          >
            Contato
          </Typography>
        </Box>
        <Typography variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.2rem' }, margin: 2,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Conheça nossos serviços e produtos, com um atendimento
          especializado e com as melhores soluções.
        </Typography>
        <Button
          sx={{
            width: { xs: '80%', md: 'auto' },
            maxWidth: '200px',
            height: 'auto',
            padding: '15px 20px',
            color: "#fff",
            transition: "0.3s",
            backgroundColor: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: { xs: '1rem', md: 'inherit' },
          }}
          href="/contato"
        >
          Contato
        </Button>
      </Box>

      {/* Seção do Blog */}
      <BlogSection postsList={postsList} />

      {/* Seção "Entre em Contato" - Repetida  */}
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          color: 'white',
          padding: { xs: 3, md: 8 },
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          marginTop: { xs: 4, md: 8 },
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/016/586/639/small_2x/abstract-gray-futuristic-pattern-for-banner-frame-png.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
            width: { xs: '100%', md: 'auto' },
            marginLeft: { xs: 0, md: 2 }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontSize: { xs: '1.8rem', md: '1.83rem' },
              marginBottom: 1,
              textAlign: 'left',
              width: '100%',
              marginLeft: { xs: 0, md: '10px' },
            }}
          >
            Entre em
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              marginBottom: 4,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              width: 'auto',
            }}
          >
            Contato
          </Typography>
        </Box>
        <Typography variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.2rem' }, margin: 2,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Conheça nossos serviços e produtos, com um atendimento
          especializado e com as melhores soluções.
        </Typography>
        <Button
          sx={{
            width: { xs: '80%', md: 'auto' },
            maxWidth: '200px',
            height: 'auto',
            padding: '15px 20px',
            color: "#fff",
            transition: "0.3s",
            backgroundColor: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: { xs: '1rem', md: 'inherit' },
          }}
          href="/contato"
        >
          Contato
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: { xs: '300px', md: '450px' },
          border: '1px solid lightgrey',
          borderRadius: '5px',
          overflow: 'hidden',
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
    </Box>
  );
}