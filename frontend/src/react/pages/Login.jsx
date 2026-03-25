import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Login() {
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  // Función que se ejecuta solo si el formulario pasa las validaciones
  //Para el ejemplo :V
  const onSubmit = (data) => {

    if (data.email === 'admin@quintadalam.com' && data.password === '12345678') {
      alert('¡Acceso concedido! Redirigiendo al panel...');
      navigate('/admin/dashboard');
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  return (
    <main>
      <section className="section section--cream login-page">
        <div className="container">
          <div className="login-wrapper">
            <div className="login__header">
              <span className="section__eyebrow">Acceso</span>
              <h1 className="section__title">Iniciar <em>Sesión</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            {/* Enlazamos el handleSubmit al formulario */}
            <form className="form login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              
              <div className="form__group">
                <label className="form__label" htmlFor="email">Correo electrónico</label>
                <input 
                  className={`form__input ${errors.email ? 'input-error' : ''}`} 
                  type="email" 
                  id="email" 
                  placeholder="ejemplo@quintadalam.mx" 
                  {...register("email", { 
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ingresa un correo válido"
                    }
                  })} 
                />
                {/* Mostramos el error si existe */}
                {errors.email && <span style={{color: '#d9534f', fontSize: '12px', marginTop: '4px', display: 'block'}}>{errors.email.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="password">Contraseña</label>
                <input 
                  className={`form__input ${errors.password ? 'input-error' : ''}`} 
                  type="password" 
                  id="password" 
                  placeholder="••••••••" 
                  {...register("password", { 
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                  })} 
                />
                {/* Mostramos el error si existe */}
                {errors.password && <span style={{color: '#d9534f', fontSize: '12px', marginTop: '4px', display: 'block'}}>{errors.password.message}</span>}
              </div>

              <div className="login__options">
                <label className="login__remember">
                  <input type="checkbox" /> Recordarme
                </label>
                <a href="#" className="login__forgot">¿Olvidaste tu contraseña?</a>
              </div>
              
              <button type="submit" className="btn btn--primary login__submit">
                <i className="fa-solid fa-right-to-bracket"></i> Acceder
              </button>
            </form>

            <div className="login__footer">
              <p className="login__register">
                ¿No tienes cuenta? <Link to="/reservaciones" className="login__register-link">Haz una reservación</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}