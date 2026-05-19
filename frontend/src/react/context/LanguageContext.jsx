import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const dictionary = {
  es: {
    rooms: 'Habitaciones',
    about: 'Nosotros',
    contact: 'Contacto',
    myAccount: 'Mi cuenta',
    myReservations: 'Mis reservaciones',
    login: 'Iniciar Sesion',
    register: 'Registrarse',
    logout: 'Cerrar Sesion',
    reserveNow: 'Reservar Ahora',
    reserve: 'Reservar',
    adminPanel: 'Panel admin',
    boutiqueHotel: 'Hotel Boutique',
    theme: 'Cambiar tema',
    menu: 'Abrir menu de navegacion',
    common: {
      bookNow: 'Reservar Ahora',
      book: 'Reservar',
      contactUs: 'Contactanos',
      viewDetails: 'Ver detalles',
      viewAllRooms: 'Ver todas las habitaciones',
      loadingRooms: 'Cargando habitaciones...',
      noRooms: 'No hay habitaciones activas por mostrar.',
      perNight: 'Tarifa por noche',
      guests: 'Huespedes',
      search: 'Buscar',
      clear: 'Limpiar',
      selectDates: 'Selecciona check-in y check-out',
      datePicker: 'Abrir selector de fechas',
      people: 'Personas',
      person: 'Persona'
    },
    home: {
      heroTitleLine1: 'Vive la Magia',
      heroTitleLine2: 'de Michoacan',
      heroSubtitle: 'Descubre la hospitalidad, artesania y cultura de los Pueblos Magicos.',
      bookingDates: 'Fechas de Llegada y Salida',
      roomsEyebrow: 'Nuestras Suites',
      roomsTitle: 'Habitaciones con',
      roomsTitleEm: 'Encanto',
      roomsSubtitle: 'Diseno inspirado en la tradicion y el confort contemporaneo',
      experiencesEyebrow: 'La Experiencia Dalam',
      experiencesTitle: 'Momentos que',
      experiencesTitleEm: 'Perduran',
      experiencesSubtitle: 'Cada rincon de Michoacan tiene una historia que contarte',
      servicesEyebrow: 'Lo que ofrecemos',
      servicesTitle: 'Servicios de',
      servicesTitleEm: 'Distincion',
      servicesSubtitle: 'Todo lo necesario para una estancia verdaderamente inolvidable',
      lookbookEyebrow: 'Atmosfera',
      lookbookTitle: 'Nuestra',
      lookbookTitleEm: 'Esencia',
      lookbookSubtitle: 'Capturamos los momentos que definen la estancia en Quinta Dalam',
      aboutEyebrow: 'Nuestra Historia',
      aboutTitle: 'Una Experiencia',
      aboutTitleEm: 'Boutique',
      aboutDesc: 'Hotel Quinta Dalam nacio del amor por la cultura michoacana y el arte de la hospitalidad...',
      aboutButton: 'Conocer nuestra historia',
      hospitalityYears: 'anos de hospitalidad',
      roomsData: [
        { sub: 'Naturaleza & Tradicion', desc: 'Frescura, armonia y descanso entre ecos de bosque y artesania local.' },
        { sub: 'Historia & Elegancia', desc: 'Elegancia clasica y serenidad a orillas del lago mas mistico de Mexico.' },
        { sub: 'Arte & Autenticidad', desc: 'Artesania viva, musica de fondo y la calidez del pueblo mas musical.' }
      ],
      services: [
        { title: 'Habitaciones Premium', text: 'Diseno boutique con maximo confort y detalles artesanales unicos.' },
        { title: 'Entorno Natural', text: 'Tranquilidad y conexion profunda con la naturaleza michoacana.' },
        { title: 'Atencion Personalizada', text: 'Hospitalidad autentica michoacana con calidez y servicio de lujo.' },
        { title: 'Desayuno Regional', text: 'Sabores tradicionales que despiertan los sentidos cada manana.' }
      ],
      experiences: ['Artesania\nMichoacana', 'Naturaleza\nAsombrosa', 'Cultura y\nHospitalidad', 'Gastronomia\nRegional']
    },
    roomsPage: {
      eyebrow: 'Nuestras Suites',
      title: 'Descanso y',
      titleEm: 'Tradicion',
      subtitle: 'Cada espacio refleja la esencia de Michoacan con artesania local y confort contemporaneo.',
      availability: 'Disponibilidad',
      choose: 'Elige tu',
      chooseEm: 'Suite',
      loaded: 'Habitaciones cargadas desde la base de datos del hotel.',
      loadError: 'No fue posible cargar las habitaciones.',
      amenities: 'Amenidades de',
      includedWifi: 'Wi-Fi incluido',
      air: 'Aire acondicionado',
      breakfast: 'Desayuno incluido',
      premiumAmenity: 'Amenidad premium'
    },
    aboutPage: {
      title: 'Nuestra',
      titleEm: 'Historia',
      subtitle: 'Pasion por Michoacan, vocacion por la hospitalidad',
      legacy: 'Legado Familiar',
      caption: 'El refugio familiar que se transformo en un tributo a Michoacan.',
      lead: 'Quinta Dalam nace en Quencio, un pueblito pintoresco de Michoacan con un hermoso nacimiento de agua.',
      p1: 'Originalmente concebido por Daniel, un joven visionario, y su padre Roberto, el proyecto comenzo como un hogar familiar destinado a dejar una huella positiva, mas alla de lo lucrativo. Anos de esfuerzo y desvelos levantaron este edificio frente al manantial, sin romper la armonia del pueblo.',
      p2: 'Aunque el proyecto sobrevivio al inicio de la pandemia, tristemente Daniel y Laura fueron victimas mortales de la misma, dejando luto en la familia Medina.',
      p3: 'En un acto de amor puro, Roberto continuo la obra de su hijo, plasmando en cada habitacion un pedazo de Michoacan y el espiritu inquebrantable de la familia. Hoy, Quinta Dalam es un refugio de paz, tradicion y amor que honra su memoria.',
      who: 'Quienes Somos',
      missionVision: 'Mision &',
      visionEm: 'Vision',
      missionTitle: 'Nuestra',
      missionEm: 'Mision',
      missionText: 'Brindar una experiencia de hospitalidad autentica que celebre la riqueza cultural de los Pueblos Magicos de Michoacan. Cada detalle de nuestra casa refleja el compromiso con la tradicion, el arte local y el bienestar de cada huesped.',
      visionTitle: 'Nuestra',
      visionText: 'Ser el referente de hospitalidad boutique en Michoacan, reconocidos por preservar el patrimonio cultural mientras ofrecemos experiencias que conectan a nuestros huespedes con la esencia profunda de esta tierra magica.',
      valuesEyebrow: 'Lo que nos define',
      valuesTitle: 'Nuestros',
      valuesEm: 'Valores',
      values: [
        { title: 'Hospitalidad', text: 'Cada huesped es parte de nuestra familia. El calor michoacano en cada gesto.' },
        { title: 'Sustentabilidad', text: 'Compromiso con el medio ambiente y las comunidades locales de Michoacan.' },
        { title: 'Cultura', text: 'Preservamos y celebramos las tradiciones artesanales y gastronomicas del estado.' },
        { title: 'Excelencia', text: 'Estandares de calidad que elevan cada detalle de tu experiencia.' }
      ]
    },
    contactPage: {
      eyebrow: 'Estamos aqui para ti',
      title: 'Contacto',
      subtitle: 'Escribenos o visitanos en el corazon de Michoacan',
      formTitle: 'Envianos un',
      formTitleEm: 'Mensaje',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electronico',
      phone: 'Telefono (opcional)',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      visitTitle: 'Visitanos en',
      address: 'Direccion',
      phoneLabel: 'Telefono',
      emailLabel: 'Correo',
      hours: 'Horario de atencion',
      hoursText: 'Lunes a domingo · 8:00 - 20:00 hrs',
      placeholders: {
        firstName: 'Tu nombre',
        lastName: 'Tu apellido',
        subject: 'En que podemos ayudarte?',
        message: 'Cuentanos mas...'
      },
      validations: {
        nameRequired: 'El nombre es obligatorio',
        emailRequired: 'El correo es obligatorio',
        emailInvalid: 'Ingresa un correo valido',
        phoneInvalid: 'Si ingresas un telefono, debe ser valido',
        subjectRequired: 'El asunto es obligatorio',
        messageRequired: 'El mensaje no puede estar vacio',
        messageMin: 'Escribe al menos 10 caracteres',
        sent: 'Mensaje enviado correctamente!'
      }
    },
    reservationsPage: {
      eyebrow: 'Reservaciones',
      title: 'Nueva',
      titleEm: 'Reservacion',
      fullName: 'Nombre completo',
      email: 'Correo electronico',
      phone: 'Telefono',
      stayDates: 'Fechas de estancia (check-in / check-out)',
      nightsSelected: 'noche(s) seleccionada(s)',
      guestCount: 'Numero de personas',
      availableRoom: 'Habitacion disponible',
      noRooms: 'No hay habitaciones para mostrar',
      chooseDates: 'Elige tus fechas para validar disponibilidad real.',
      comments: 'Comentarios adicionales',
      commentsPlaceholder: 'Escribe aqui alguna solicitud especial...',
      submit: 'Completar Reservacion',
      creating: 'Creando reservacion...',
      noticeEmpty: 'Primero se crea la reservacion; despues se habilita el pago seguro.',
      noticeCreated: 'Reservacion {code} creada en PENDING_PAYMENT.',
      roomSummary: 'Resumen de habitacion seleccionada',
      noSuitesTitle: 'Sin suites para mostrar',
      noSuitesDesc: 'No fue posible cargar habitaciones desde la base de datos.',
      defaultDesc: 'Suite disponible para tu estancia.'
    },
    checkout: {
      eyebrow: 'Pago Seguro',
      title: 'Resumen de',
      titleEm: 'Reservacion',
      noSuite: 'Sin suite seleccionada',
      taxesIncluded: 'Impuestos incluidos',
      included: 'Incluido',
      total: 'Total a pagar',
      paid: 'Pago confirmado por Stripe',
      button: 'Proceder al pago seguro',
      opening: 'Abriendo Stripe...',
      hint: 'Completa el formulario de reservacion para habilitar el pago.'
    },
    cta: {
      eyebrow: 'Ven a conocernos',
      title: 'Reserva tu experiencia',
      description: 'Descubre de cerca lo que nos hace unicos en Michoacan.'
    },
    event: {
      eyebrow: 'Eventos Boutique',
      title: 'Celebra en nuestro',
      titleEm: 'Jardin',
      copy: 'Si estas pensando en organizar tu evento en un hermoso jardin y aun no sabes donde... Ven a Quinta Dalam. Contamos con el lugar indicado.',
      button: 'Cotizar evento',
      alt: 'Jardin principal de Quinta Dalam para eventos'
    },
    footer: {
      desc: 'Un refugio colonial donde la tradicion y el lujo se encuentran en el corazon de Michoacan.',
      explore: 'Explora',
      reservations: 'Reservaciones',
      social: 'Redes Sociales',
      copyright: 'Todos los derechos reservados.',
      sitemap: 'Mapa del sitio'
    }
  },
  en: {
    rooms: 'Rooms',
    about: 'About',
    contact: 'Contact',
    myAccount: 'My account',
    myReservations: 'My reservations',
    login: 'Sign in',
    register: 'Register',
    logout: 'Sign out',
    reserveNow: 'Book Now',
    reserve: 'Book',
    adminPanel: 'Admin panel',
    boutiqueHotel: 'Boutique Hotel',
    theme: 'Change theme',
    menu: 'Open navigation menu',
    common: {
      bookNow: 'Book Now',
      book: 'Book',
      contactUs: 'Contact us',
      viewDetails: 'View details',
      viewAllRooms: 'View all rooms',
      loadingRooms: 'Loading rooms...',
      noRooms: 'No active rooms to show.',
      perNight: 'Rate per night',
      guests: 'Guests',
      search: 'Search',
      clear: 'Clear',
      selectDates: 'Select check-in and check-out',
      datePicker: 'Open date picker',
      people: 'Guests',
      person: 'Guest'
    },
    home: {
      heroTitleLine1: 'Experience the Magic',
      heroTitleLine2: 'of Michoacan',
      heroSubtitle: 'Discover the hospitality, craftsmanship, and culture of Michoacan.',
      bookingDates: 'Arrival and Departure Dates',
      roomsEyebrow: 'Our Suites',
      roomsTitle: 'Rooms with',
      roomsTitleEm: 'Charm',
      roomsSubtitle: 'Design inspired by tradition and contemporary comfort',
      experiencesEyebrow: 'The Dalam Experience',
      experiencesTitle: 'Moments that',
      experiencesTitleEm: 'Last',
      experiencesSubtitle: 'Every corner of Michoacan has a story to tell',
      servicesEyebrow: 'What we offer',
      servicesTitle: 'Services of',
      servicesTitleEm: 'Distinction',
      servicesSubtitle: 'Everything you need for a truly unforgettable stay',
      lookbookEyebrow: 'Atmosphere',
      lookbookTitle: 'Our',
      lookbookTitleEm: 'Essence',
      lookbookSubtitle: 'We capture the moments that define a stay at Quinta Dalam',
      aboutEyebrow: 'Our Story',
      aboutTitle: 'A Boutique',
      aboutTitleEm: 'Experience',
      aboutDesc: 'Hotel Quinta Dalam was born from a love for Michoacan culture and the art of hospitality...',
      aboutButton: 'Discover our story',
      hospitalityYears: 'years of hospitality',
      roomsData: [
        { sub: 'Nature & Tradition', desc: 'Freshness, harmony, and rest among forest echoes and local craftsmanship.' },
        { sub: 'History & Elegance', desc: 'Classic elegance and serenity near one of Mexico most mystical lakes.' },
        { sub: 'Art & Authenticity', desc: 'Living craftsmanship, soft music, and the warmth of a musical town.' }
      ],
      services: [
        { title: 'Premium Rooms', text: 'Boutique design with maximum comfort and unique handcrafted details.' },
        { title: 'Natural Setting', text: 'Peace and a deep connection with Michoacan nature.' },
        { title: 'Personalized Service', text: 'Authentic Michoacan hospitality with warmth and refined service.' },
        { title: 'Regional Breakfast', text: 'Traditional flavors that awaken the senses every morning.' }
      ],
      experiences: ['Michoacan\nCrafts', 'Amazing\nNature', 'Culture and\nHospitality', 'Regional\nCuisine']
    },
    roomsPage: {
      eyebrow: 'Our Suites',
      title: 'Rest and',
      titleEm: 'Tradition',
      subtitle: 'Each space reflects the essence of Michoacan with local craftsmanship and contemporary comfort.',
      availability: 'Availability',
      choose: 'Choose your',
      chooseEm: 'Suite',
      loaded: 'Rooms loaded from the hotel database.',
      loadError: 'Rooms could not be loaded.',
      amenities: 'Amenities for',
      includedWifi: 'Wi-Fi included',
      air: 'Air conditioning',
      breakfast: 'Breakfast included',
      premiumAmenity: 'Premium amenity'
    },
    aboutPage: {
      title: 'Our',
      titleEm: 'Story',
      subtitle: 'Passion for Michoacan, vocation for hospitality',
      legacy: 'Family Legacy',
      caption: 'The family refuge that became a tribute to Michoacan.',
      lead: 'Quinta Dalam was born in Quencio, a picturesque village in Michoacan with a beautiful natural spring.',
      p1: 'Originally conceived by Daniel, a young visionary, and his father Roberto, the project began as a family home meant to leave a positive mark beyond profit. Years of effort raised this building in front of the spring without breaking the harmony of the town.',
      p2: 'Although the project survived the beginning of the pandemic, Daniel and Laura sadly lost their lives to it, leaving the Medina family in mourning.',
      p3: 'In an act of pure love, Roberto continued his son work, placing a piece of Michoacan and the unbreakable spirit of the family in every room. Today, Quinta Dalam is a refuge of peace, tradition, and love that honors their memory.',
      who: 'Who We Are',
      missionVision: 'Mission &',
      visionEm: 'Vision',
      missionTitle: 'Our',
      missionEm: 'Mission',
      missionText: 'To provide an authentic hospitality experience that celebrates the cultural richness of Michoacan. Every detail of our house reflects our commitment to tradition, local art, and each guest well-being.',
      visionTitle: 'Our',
      visionText: 'To be a benchmark for boutique hospitality in Michoacan, recognized for preserving cultural heritage while offering experiences that connect guests with the deep essence of this magical land.',
      valuesEyebrow: 'What defines us',
      valuesTitle: 'Our',
      valuesEm: 'Values',
      values: [
        { title: 'Hospitality', text: 'Every guest is part of our family. Michoacan warmth in every gesture.' },
        { title: 'Sustainability', text: 'Commitment to the environment and local communities of Michoacan.' },
        { title: 'Culture', text: 'We preserve and celebrate the state handcrafted and culinary traditions.' },
        { title: 'Excellence', text: 'Quality standards that elevate every detail of your experience.' }
      ]
    },
    contactPage: {
      eyebrow: 'We are here for you',
      title: 'Contact',
      subtitle: 'Write to us or visit us in the heart of Michoacan',
      formTitle: 'Send us a',
      formTitleEm: 'Message',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone (optional)',
      subject: 'Subject',
      message: 'Message',
      send: 'Send message',
      visitTitle: 'Visit us in',
      address: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hours: 'Service hours',
      hoursText: 'Monday to Sunday · 8:00 - 20:00',
      placeholders: {
        firstName: 'Your first name',
        lastName: 'Your last name',
        subject: 'How can we help?',
        message: 'Tell us more...'
      },
      validations: {
        nameRequired: 'First name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Enter a valid email',
        phoneInvalid: 'If you enter a phone number, it must be valid',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message cannot be empty',
        messageMin: 'Write at least 10 characters',
        sent: 'Message sent successfully!'
      }
    },
    reservationsPage: {
      eyebrow: 'Reservations',
      title: 'New',
      titleEm: 'Reservation',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      stayDates: 'Stay dates (check-in / check-out)',
      nightsSelected: 'night(s) selected',
      guestCount: 'Number of guests',
      availableRoom: 'Available room',
      noRooms: 'No rooms to show',
      chooseDates: 'Choose your dates to validate real availability.',
      comments: 'Additional comments',
      commentsPlaceholder: 'Write any special request here...',
      submit: 'Complete Reservation',
      creating: 'Creating reservation...',
      noticeEmpty: 'The reservation is created first; secure payment is enabled afterward.',
      noticeCreated: 'Reservation {code} created in PENDING_PAYMENT.',
      roomSummary: 'Selected room summary',
      noSuitesTitle: 'No suites to show',
      noSuitesDesc: 'Rooms could not be loaded from the database.',
      defaultDesc: 'Suite available for your stay.'
    },
    checkout: {
      eyebrow: 'Secure Payment',
      title: 'Reservation',
      titleEm: 'Summary',
      noSuite: 'No suite selected',
      taxesIncluded: 'Taxes included',
      included: 'Included',
      total: 'Total to pay',
      paid: 'Payment confirmed by Stripe',
      button: 'Proceed to secure payment',
      opening: 'Opening Stripe...',
      hint: 'Complete the reservation form to enable payment.'
    },
    cta: {
      eyebrow: 'Come meet us',
      title: 'Book your experience',
      description: 'Discover up close what makes us unique in Michoacan.'
    },
    event: {
      eyebrow: 'Boutique Events',
      title: 'Celebrate in our',
      titleEm: 'Garden',
      copy: 'If you are thinking about hosting your event in a beautiful garden and still do not know where... Come to Quinta Dalam. We have the right place.',
      button: 'Request event quote',
      alt: 'Main garden at Quinta Dalam for events'
    },
    footer: {
      desc: 'A colonial refuge where tradition and luxury meet in the heart of Michoacan.',
      explore: 'Explore',
      reservations: 'Reservations',
      social: 'Social Media',
      copyright: 'All rights reserved.',
      sitemap: 'Sitemap'
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('qd_language') || 'es');

  const setLanguage = (nextLanguage) => {
    const safeLanguage = nextLanguage === 'en' ? 'en' : 'es';
    localStorage.setItem('qd_language', safeLanguage);
    document.documentElement.lang = safeLanguage;
    setLanguageState(safeLanguage);
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: dictionary[language] || dictionary.es
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  return context;
}
