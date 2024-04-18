import { Card, CardContent, CardHeader, Typography } from '@mui/material';
// import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import '../../scss/components/_CardUse.scss';

interface Props {
  step: { title: string, description: string, icon: any }
}


const CardUseApp: React.FC<Props> = ({ step }) => {
  return (
    // <ParallaxProvider>
    //   <Parallax opacity={[1, 1]}>
        <div>
          <Card className='cardUse'>
            <CardHeader
              title={<div className='titleUsecard'>{step.title}</div>}
              avatar= { 
                <img src={step.icon} alt="icono" />
              }
              // avatar={ <div  className='iconTitle'>step.icon </div>}
            />
            <hr className='hrDiv' />
            <CardContent>
              <Typography variant="body1" className='descriptionUse'>{step.description}</Typography>
            </CardContent>
          </Card>
        </div>
    //   </Parallax>
    // </ParallaxProvider>
  );
}

export default CardUseApp