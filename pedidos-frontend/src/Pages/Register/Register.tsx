import { Link, useNavigate } from 'react-router-dom';
import '../../scss/components/register.scss';
import { FieldError, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import logo from "../../assets/logos/xsinfondo.png";
import axios from 'axios';



interface UserRegister {
  username: string;
  password: string;
}

const Register = () => {
  const { handleSubmit, register, watch, formState: { errors } } = useForm();
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const onSubmit = (data: any) => {
    const URL = import.meta.env.VITE_API_URL
    const User: UserRegister = { username: data.email, password: data.password }
    axios.post(`${URL}/signup`, User).then((resp: any) => {
      console.log("respuesta de signup", resp);
      Toast.fire({
        icon: "success",
        title: `${resp.data.message}`,
      }).then(() => {
        navigate("/login");
      });
    }).catch((error) => {
      console.log(error);
      // Mostrar un mensaje de error al usuario
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error durante el registro.",
        width: "20rem",
        padding: "0.5rem",
      });
    });
  };

  return (
    <div className="register-container">
      <div className="content">
        <div className="form-container">
          <Link className="logoX" to="/home">
            <img className="capitan" src={logo} alt="logo" />
          </Link>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="form-input"
              {...register("email", {
                required: {
                  value: true,
                  message: "Correo electrónico requerido",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Correo electrónico no válido",
                },
              })}
            />
            {errors.email && (
              <span className="form-error"> {(errors.email as FieldError).message}</span>
            )}
            <input
              type="password"
              placeholder="Contraseña"
              className="form-input"
              {...register("password", {
                required: {
                  value: true,
                  message: "Contraseña requerida",
                },
              })}
            />
            {errors.password && (
              <span className="form-error"> {(errors.password as FieldError).message}</span>
            )}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="form-input"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirmar contraseña requerida",
                },
                validate: value => value === watch("password") || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && (
              <span className="form-error"> {(errors.confirmPassword as FieldError).message}</span>
            )}
            <button type="submit" className="submit-button">Registrar</button>
            <Link to="/login" className="already-account-button">Si ya tienes cuenta, ingresa aquí</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
