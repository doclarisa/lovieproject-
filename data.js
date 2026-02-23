// LovieProject Shared Data

const profiles = [
  {
    id: 1,
    name: 'Katerina Volkov',
    country: 'Russia',
    city: 'Moscow',
    tags: ['artist', 'painter', 'teacher'],
    bio: 'Contemporary painter exploring themes of cultural identity and resilience through vibrant abstract works.',
    fullBio: {
      en: 'Katerina Volkov is a prolific contemporary painter based in Moscow with over 30 years of artistic experience. Her work explores themes of cultural identity, resilience, and the human spirit through bold, vibrant abstract compositions. She has exhibited in major galleries across Europe and has mentored hundreds of emerging artists through her creative workshops and teaching practice. When not painting, Katerina loves traveling to remote regions to find inspiration in diverse cultures and landscapes.',
      ru: 'Катерина Волков — плодовитая современная художница, работающая в Москве с более чем 30-летним опытом. Её работы исследуют темы культурной идентичности, устойчивости и человеческого духа через смелые, яркие абстрактные композиции. Она выставлялась в крупных галереях по всей Европе и наставляла сотни начинающих художников через свои творческие мастер-классы и преподавание. Когда она не рисует, Катерина любит путешествовать в отдаленные регионы, чтобы найти вдохновение в разных культурах и пейзажах.'
    },
    color: '#E8C8A0',
    tagClasses: ['tag-artist', 'tag-teacher'],
    email: 'katerina@lovieproject.com',
    website: 'https://katerinavolkov.art',
    instagram: 'https://instagram.com/katerina.volkov',
    phone: null,
    gallery: [
      { color: '#E8C8A0', title: 'Morning Light Series' },
      { color: '#D4A574', title: 'Cultural Identity' },
      { color: '#B8936B', title: 'Resilience Through Color' },
      { color: '#A84B7A', title: 'Abstract Dreams' }
    ]
  },
  {
    id: 2,
    name: 'Svetlana Petrov',
    country: 'Canada',
    city: 'Toronto',
    tags: ['healer', 'wellness', 'guide'],
    bio: 'Holistic wellness coach specializing in energy healing and mindfulness for mature women.',
    fullBio: {
      en: 'Svetlana Petrov is a certified holistic health practitioner and energy healing specialist with 25+ years of experience in wellness and life coaching. Her approach combines Eastern healing traditions with modern science to create transformative experiences for her clients. Specializing in working with women navigating life transitions, Svetlana helps clients reconnect with their inner wisdom, release limiting beliefs, and embrace their authentic power. She offers both in-person and virtual sessions, as well as group workshops and training programs.',
      ru: 'Светлана Петров — сертифицированный практик холистического здоровья и специалист по энергетическому исцелению с более чем 25-летним опытом в области благополучия и коучинга. Её подход сочетает восточные техники исцеления с современной наукой для создания трансформирующего опыта. Специализируясь на работе с женщинами, переживающими жизненные переходы, Светлана помогает клиентам переподключиться к своей внутренней мудрости, отпустить ограничивающие убеждения и принять свою подлинную силу.'
    },
    color: '#A84B7A',
    tagClasses: ['tag-healer', 'tag-guide'],
    email: 'svetlana@lovieproject.com',
    website: 'https://healwithsveta.com',
    instagram: 'https://instagram.com/svetlana.wellness',
    phone: null,
    gallery: [
      { color: '#A84B7A', title: 'Healing Circle' },
      { color: '#8B3A62', title: 'Energy Work' },
      { color: '#6B4C8A', title: 'Mindfulness Retreat' },
      { color: '#4A9D9A', title: 'Transformation Journey' }
    ]
  },
  {
    id: 3,
    name: 'Irina Sokolov',
    country: 'Germany',
    city: 'Berlin',
    tags: ['photographer', 'travel', 'writer'],
    bio: 'Travel photographer capturing stories of women around the world and building cross-cultural connections.',
    fullBio: {
      en: 'Irina Sokolov is an award-winning travel photographer and travel writer with a passion for storytelling through images. Over the past 20 years, she has documented the lives of remarkable women across 50+ countries, creating powerful narratives that celebrate resilience, creativity, and cultural diversity. Her work has been featured in National Geographic, Smithsonian Magazine, and numerous international publications. She also leads photography workshops and cultural immersion trips for aspiring photographers and travel enthusiasts.',
      ru: 'Ирина Соколов — отмеченная наградами фотограф путешественница и писатель, увлеченная повествованием через изображения. За последние 20 лет она документировала жизнь замечательных женщин в более чем 50 странах, создавая мощные повествования, которые прославляют устойчивость, творчество и культурное разнообразие. Её работы были опубликованы в National Geographic, Smithsonian Magazine и многих международных изданиях.'
    },
    color: '#6B9E81',
    tagClasses: ['tag-photographer', 'tag-writer'],
    email: 'irina@lovieproject.com',
    website: 'https://irinas-lens.com',
    instagram: 'https://instagram.com/irina.sokolov',
    phone: null,
    gallery: [
      { color: '#6B9E81', title: 'Women of Morocco' },
      { color: '#4A9D9A', title: 'Japanese Tea Ceremony' },
      { color: '#2B7A78', title: 'Stories from India' },
      { color: '#1D5A57', title: 'Peruvian Wisdom' }
    ]
  }
];
