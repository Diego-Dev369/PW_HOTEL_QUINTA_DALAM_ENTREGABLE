import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CTA from '../components/CTA';
import { getPublicRooms } from '../services/roomService';
import { useLanguage } from '../context/LanguageContext.jsx';

import roomUruapan from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho from '../../assets/images/rooms/102-paracho.jpeg';
import roomYunuen from '../../assets/images/rooms/103-yunuen.jpeg';
import roomCuanajo from '../../assets/images/rooms/207-cuanajo.jpeg';
import roomTlalpujagua from '../../assets/images/rooms/205-tlalpujagua.jpeg';
import noImage from '../../assets/icons/no_image_available.png';

const roomImages = {
  'suite-uruapan': roomUruapan,
  'suite-patzcuaro': roomPatzcuaro,
  'suite-paracho': roomParacho,
  'suite-yunuen': roomYunuen,
  'suite-cuanajo': roomCuanajo,
  'suite-tlalpujagua': roomTlalpujagua,
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const inView = { viewport: { once: true, margin: '-50px' } };

function roomDisplayName(name = '') {
  return name.replace(/^Suite\s+/i, '').trim() || name;
}

function formatRate(amount, currency = 'MXN') {
  const value = Number(amount || 0);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function amenityIcons(room, t) {
  const base = [
    ['fa-wifi', t.roomsPage.includedWifi],
    ['fa-snowflake', t.roomsPage.air],
    ['fa-mug-hot', t.roomsPage.breakfast],
  ];

  if ((room.category || '').toLowerCase().includes('superior') || room.featured) {
    base.push(['fa-bath', t.roomsPage.premiumAmenity]);
  }

  return base;
}

export default function Habitaciones() {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadRooms() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPublicRooms();
        if (alive) setRooms(data || []);
      } catch (err) {
        if (alive) setError(err?.response?.data?.message || t.roomsPage.loadError);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadRooms();
    return () => { alive = false; };
  }, []);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">{t.roomsPage.eyebrow}</span>
          <h1 className="page-hero__title">{t.roomsPage.title} <em>{t.roomsPage.titleEm}</em></h1>
          <p className="page-hero__subtitle">
            {t.roomsPage.subtitle}
          </p>
          <span className="page-hero__ornament" aria-hidden="true">* --- * --- *</span>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.section
          className="section section--cream rooms-page"
          aria-labelledby="h2-suites"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          {...inView}
        >
          <div className="container">
            <motion.div className="section__header" variants={fadeUp}>
              <span className="section__eyebrow">{t.roomsPage.availability}</span>
              <h2 className="section__title" id="h2-suites">{t.roomsPage.choose} <em>{t.roomsPage.chooseEm}</em></h2>
              <p className="section__subtitle">{t.roomsPage.loaded}</p>
              <span className="section__ornament" aria-hidden="true">* --- * --- *</span>
            </motion.div>
          </div>

          <div className="container">
            {loading && (
              <p className="form-feedback form-feedback--info">{t.common.loadingRooms}</p>
            )}

            {error && (
              <p className="form-feedback form-feedback--error">{error}</p>
            )}

            {!loading && !error && rooms.length === 0 && (
              <p className="form-feedback form-feedback--info">{t.common.noRooms}</p>
            )}

            <motion.div
              className="rooms-page__list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              {...inView}
            >
              {rooms.map((room) => {
                const displayName = roomDisplayName(room.name);
                const image = roomImages[room.code] || noImage;
                const price = formatRate(room.nightlyRateAmount, room.currency || 'MXN');

                return (
                  <motion.article className="room-row" id={room.code} variants={fadeUp} key={room.id}>
                    <div className="room-row__left">
                      <div className={`room-card ${room.featured ? 'room-card--featured' : ''}`}>
                        <div className="room-card__img-wrap">
                          <img
                            src={image}
                            alt={room.name}
                            className="room-card__img"
                            loading="lazy"
                            width="600"
                            height="450"
                          />
                          <span className="room-card__badge">{room.category}</span>
                        </div>
                        <div className="room-card__body">
                          <h3 className="room-card__title">{displayName}</h3>
                          {room.subtitle && <em className="room-card__sub">{room.subtitle}</em>}
                          {room.description && <p className="room-card__desc">{room.description}</p>}
                          <ul className="room-card__amenities" aria-label={`${t.roomsPage.amenities} ${room.name}`}>
                            {amenityIcons(room, t).map(([icon, label]) => (
                              <li className="room-card__amenity" title={label} key={icon}>
                                <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="room-row__right">
                      <h3 className="room-row__title">Suite <em>{displayName}</em></h3>
                      {room.description && <p className="room-row__text">{room.description}</p>}
                      <div className="room-row__specs">
                        <span><i className="fa-solid fa-user-group" aria-hidden="true"></i> {room.capacity} {t.common.people}</span>
                        {room.bedType && <span><i className="fa-solid fa-bed" aria-hidden="true"></i> {room.bedType}</span>}
                        {room.category && <span><i className="fa-solid fa-door-open" aria-hidden="true"></i> {room.category}</span>}
                      </div>
                      <div className="room-row__action">
                        <div className="room-row__price">
                          <small>{t.common.perNight}</small>
                          <strong>{price} <span>{room.currency || 'MXN'}</span></strong>
                        </div>
                        <Link to={`/reservaciones?room=${room.code}`} className="btn btn--primary">{t.common.bookNow}</Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        <CTA />
      </motion.main>
    </>
  );
}

