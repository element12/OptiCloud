import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuariosApi } from "../api/ApiGlobal";
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email es inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Simulate API call
        const res = await usuariosApi.post("/login", { email: formData.email, password: formData.password });
        const data = res.data;

        localStorage.setItem("token", data.usuario.token);
        localStorage.setItem("isLogged", "true");

        navigate("/dashboard", { replace: true });
      } catch (error) {
        setErrors({ ...errors, api: 'Contraseña incorrecta' });
        setIsSubmitting(false);
      }
    
    }
  };

  return (
    <div className="page-login">
      <div className="auth-container">
        <h2>Sistema OptiCloud</h2>

        {errors.api && <div className="auth-error">{errors.api}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ingrese su correo electrónico"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
        </div> */}

          <button type="submit" disabled={isSubmitting} className="auth-button">
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="auth-link">
            Para registrarse <Link to="/register">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;