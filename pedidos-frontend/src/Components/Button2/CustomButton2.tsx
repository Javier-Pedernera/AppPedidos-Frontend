import { styled } from '@mui/system';

interface CustomButtonProps {
  onClick: () => void;
  titulo: string,
  color1: string,
  color2: string,
  disabled: boolean
}


const CustomButton2: React.FC<CustomButtonProps> = ({ onClick, titulo, color1, color2, disabled }) => {

  const StyledButton = styled('button')`
    --c: goldenrod;
    color: ${color1};
    font-size: 0.8em;
    border: 0.2em solid ${color1};
    border-radius: 0.5em;
    width: 10em;
    height: 3em;
    text-transform: uppercase;
    font-weight: 600;
    font-family: var(--font-poppins);
    letter-spacing: 0.1em;
    text-align: center;
    line-height: 3em;
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: 0.5s;
    margin: 1em;
  
    &:hover {
      color: var(--tertiary-color)
    }
  
    &:hover span {
      transform: translateY(0) scale(2);
    }
  
    span {
      
      position: absolute;
      width: 25%;
      height: 100%;
      background-color: ${color2};
      transform: translateY(150%);
      border-radius: 50%;
      left: calc((var(--n) - 1) * 25%);
      transition: 0.5s;
      transition-delay: calc((var(--n) - 1) * 0.1s);
      z-index: -1;
    }
  
    span:nth-child(1) {
      --n: 1;
    }
  
    span:nth-child(2) {
      --n: 2;
    }
  
    span:nth-child(3) {
      --n: 3;
    }
  
    span:nth-child(4) {
      --n: 4;
    }
  `;


  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {titulo}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </StyledButton>
  );
}

export default CustomButton2;