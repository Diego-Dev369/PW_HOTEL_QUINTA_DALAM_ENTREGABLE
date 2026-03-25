import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const inView = { viewport: { once: true, margin: '-50px' } };

export default function CTA({ 
    eyebrow = "Ven a conocernos", 
    titulo = "Reserva tu experiencia", 
    descripcion = "Descubre de cerca lo que nos hace únicos en Michoacán.",
    textoBoton1 = "Reservar ahora",
    textoBoton2 = "Contáctanos"
    }) {
    
    // Función para darle el estilo <em> a palabras clave automáticamente
    const formatearTitulo = (texto) => {
        return texto
        .replace('reservación', '<em>reservación</em>')
        .replace('experiencia', '<em>experiencia</em>');
    };

    return (
        <motion.section
        className="cta-band"
        aria-label="Llamada a reservar"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        {...inView}
        >
        <div className="cta-band__inner">
            <div className="cta-band__text">
            <span className="section__eyebrow section__eyebrow--gold">{eyebrow}</span>
            <h2 
                className="cta-band__title" 
                dangerouslySetInnerHTML={{ __html: formatearTitulo(titulo) }}
            ></h2>
            <p className="cta-band__desc">{descripcion}</p>
            </div>
            <div className="cta-band__actions">
            <Link to="/reservaciones" className="btn btn--primary">{textoBoton1}</Link>
            <Link to="/contacto" className="btn btn--ghost-light">{textoBoton2}</Link>
            </div>
        </div>
        </motion.section>
    );
}