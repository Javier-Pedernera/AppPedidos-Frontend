
import { useState } from 'react';
import { TextField, Button, Typography, Grid, AccordionSummary, Accordion, AccordionDetails } from '@mui/material';
import '../../scss/components/_Home.scss';
import imagemoto from "../../assets/images/imagen5.png"
// import { Link } from 'react-router-dom';
import CardUseApp from '../../Components/cardUse/CardUseApp';
import { MdExpandMore } from 'react-icons/md';
import ico1 from "../../assets/iconos/1.svg";
import ico2 from "../../assets/iconos/2.svg";
import ico3 from "../../assets/iconos/3.svg";
import ico4 from "../../assets/iconos/4.svg";
import ico5 from "../../assets/iconos/5.svg";

// import { Parallax, ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';

const FAQ = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = () => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // e.preventDefault();
    setFormData({
      name: '',
      email: '',
      message: ''
    })
    console.log(formData);
  };

  const características = [
    {
      title: 'Configuración Versátil de Proyectos',
      description: `Con nuestra aplicación, puedes crear y configurar rápidamente proyectos de distribución de pedidos. Define zonas de distribución y asigna tecnologías específicas según las necesidades de tu equipo.`
    },
    {
      title: 'Colaboración Eficiente',
      description: 'El creador del proyecto o el administrador pueden agregar colaboradores para trabajar en él. Cada colaborador tiene su propio hilo de generación de pedidos, lo que facilita la colaboración y la organización del trabajo en equipo.'
    },
    {
      title: 'Biblioteca de Código',
      description: 'Nuestra aplicación ofrece una biblioteca de código donde los colaboradores pueden compartir y acceder a fragmentos de código reutilizables. Esto agiliza el proceso de desarrollo al proporcionar ejemplos y soluciones que pueden implementarse fácilmente en proyectos.'
    },
    {
      title: 'Gestión de Usuarios y Permisos',
      description: 'Nuestra aplicación cuenta con un sistema de gestión de usuarios con diferentes niveles de permisos. Esto garantiza que cada usuario solo tenga acceso a funciones y datos relevantes para su rol en la distribución de pedidos.'
    },
    {
      title: 'Seguridad Integral',
      description: 'La seguridad es una prioridad en nuestra aplicación. Todos los datos y comunicaciones están protegidos mediante medidas de seguridad avanzadas, garantizando la confidencialidad y la integridad de la información.'
    },
    {
      title: 'Interfaz Intuitiva',
      description: `La interfaz de usuario de nuestra aplicación es fácil de usar y está diseñada para proporcionar una experiencia fluida y eficiente. La navegación intuitiva y las funciones bien organizadas permiten a los usuarios trabajar de manera productiva desde el principio.`
    }
  ];


  const pasosComoUsar = [
    {
      title: 'Registrarse en la plataforma',
      description: 'Inicia sesión con tu dirección de correo electrónico para acceder a la plataforma de pedidos automatizada.',
      icon: ico1
    },
    {
      title: 'Crear nuevas zonas de distribución',
      description: 'Define y configura las zonas de distribución de pedidos según la estructura de tu área de entrega.',
      icon: ico2
    },
    {
      title: 'Agregar repartidores',
      description: 'Agrega  en la configuración de la app para asignarles pedidos o zonas',
      icon: ico3
    },
    {
      title: 'Optimizar la distribución de pedidos',
      description: 'Utiliza nuestra herramienta de distribución automática para optimizar el proceso de asignación de pedidos a las zonas definidas.',
      icon: ico4
    },
    {
      title: 'Disfrutar de una gestión eficiente de pedidos',
      description: 'Organiza y gestiona tus pedidos de forma eficiente y rápida con nuestra aplicación de pedidos automatizada.',
      icon:  ico5
    }
  ];

  return (
    // <ParallaxProvider>
      <div className="home">
        {/* <img src={logoCatitan} alt="" /> */}

        <div className='titulo'>
  <h1>Bienvenido a EntregaX: Gestión Eficiente de Pedidos</h1>
</div>
{/* <ParallaxBanner
  layers={[{ image: 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1710424148/Capitan/Dise%C3%B1o_sin_t%C3%ADtulo__16_-removebg-preview_dnooax.png', rotate: [0, 360], speed: -15 }]}
  className="parallaxTimon"
> */}
  {/* <Parallax className="parallax-container"> */}
  <div className='fondodescription'>

    <div className="sectionDescription">
      <Typography className='comoFunciona_title' gutterBottom>
        Descripción
      </Typography>
      <Typography variant="body1" gutterBottom>
        "EntregaX es una aplicación web innovadora diseñada para simplificar y optimizar la gestión de pedidos y distribución de mercancías. Con EntregaX, puedes organizar tus zonas de entrega, asignar pedidos a repartidores, y optimizar el proceso de entrega para una mayor eficiencia."
      </Typography>
    </div>

    <div className="sectioncomoFunciona">
      <Typography className='comoFunciona_title' variant="h4" gutterBottom>
        ¿Cómo funciona nuestra aplicación de pedidos?
      </Typography>
      <Typography variant="body1" gutterBottom>
        EntregaX es una aplicación web innovadora diseñada para simplificar y optimizar la gestión de pedidos y distribución de mercancías. Con EntregaX, puedes organizar tus zonas de entrega, asignar pedidos a repartidores, y optimizar el proceso de entrega para una mayor eficiencia.
      </Typography>
    </div>

  </div>
        {/* </ParallaxBanner> */}


        <div className="sectionUse">
          <Typography variant="h5" gutterBottom className='titleUse'>
            ¿Cómo usar la aplicación?
          </Typography>
          <hr className='hrDiv' />
          <Grid container spacing={2} className='conteinerCardsUse'>
            {pasosComoUsar.map((step, index) => (
              <Grid item xs={12} sm={6} md={2} key={index}>
                <CardUseApp step={step}>

                </CardUseApp>
              </Grid>
            ))}
          </Grid>
        </div>


        <div className="sectionCaract">
          <Typography className='caractUse' gutterBottom>
            Características
          </Typography>
          {características.map((feature, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<MdExpandMore className='icoExpandCaract' />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                className='acordion'
              >
                <Typography className='titleAcordion' variant="subtitle1">{feature.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{feature.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>


        <div className="sectionForm">
        <form className="form_contact" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Contacto
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mensaje"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
        <img src={imagemoto} alt="" />
        </div>

        <div className="section">
          <Typography variant="h4" gutterBottom>
            user opinions
            <hr />
          </Typography>
          <Typography variant="body1">
            Testimonials from satisfied users who have used our code assistant.
          </Typography>
        </div>
      </div >
    // </ParallaxProvider>
  );
};

export default FAQ;