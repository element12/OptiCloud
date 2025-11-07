import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuariosApi } from "../api/ApiGlobal";

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        document: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
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

        if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';

        if (!formData.email.trim()) {
            newErrors.email = 'Email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email es inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const res = await usuariosApi.post("/users/register", { email: formData.email, password: formData.password, document: formData.document, name: formData.name });
                const data = res.data;

                navigate('/login');
                alert('¡Registro exitoso! Por favor inicie sesión.');
            } catch (error) {
                console.error("Error de registro:", error);
                setErrors({ ...errors, api: 'El registro falló. Por favor, inténtelo de nuevo.' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="page-login">

            <div className="auth-container">
                <h2>Crear su cuenta</h2>

                {errors.api && <div className="auth-error">{errors.api}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Ingrese su nombre"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>Ingrese documento</label>
                        <input
                            type="text"
                            name="document"
                            value={formData.document}
                            onChange={handleChange}
                            className={errors.document ? 'error' : ''}
                            placeholder="Ingrese su documento"
                        />
                        {errors.document && <span className="error-message">{errors.document}</span>}
                    </div>

                    <div className="form-group">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Ingrese su correo"
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

                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="terms-label">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className={errors.agreeTerms ? 'error' : ''}
                            />
                            Acepto los <Link to="/terms">Términos y Condiciones</Link>
                        </label>
                        {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="auth-button">
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <div className="auth-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;