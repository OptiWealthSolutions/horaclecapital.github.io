import { getCollection } from 'astro:content';

export async function GET() {
  const allRapports = await getCollection('rapports', ({ data }) => !data.draft);
  const allRecherches = await getCollection('recherches', ({ data }) => !data.draft);

  const reportsIndex = allRapports.map(item => ({
    title: item.data.title,
    desc: item.body || item.data.description,
    shortDesc: item.data.description,
    category: item.data.category || 'Macro Economics',
    url: `/reports/${item.slug}`,
    date: item.data.date
  }));

  const researchIndex = allRecherches.map(item => ({
    title: item.data.title,
    desc: item.body || item.data.description,
    shortDesc: item.data.description,
    category: item.data.category || 'Finance Quantitative',
    url: `/recherches/${item.slug}`,
    date: item.data.date
  }));

  const pagesIndex = [
    {
      title: 'Horacle Academy',
      desc: 'Mentorat en Analyse Macroéconomique & Stratégie. Apprenez la lecture institutionnelle des marchés.',
      shortDesc: 'Mentorat de haute précision en macroéconomie.',
      category: 'Formation',
      url: '/academy',
      date: ''
    },
    {
      title: 'À Propos',
      desc: 'Découvrez l\'histoire et la méthodologie d\'Horacle Capital. Fondé par Léo Lombardini.',
      shortDesc: 'L\'expertise derrière Horacle Capital.',
      category: 'Institutionnel',
      url: '/about',
      date: ''
    },
    {
      title: 'Thèses & Portfolio',
      desc: 'Suivez nos positions réelles et nos thèses d\'investissement moyen terme.',
      shortDesc: 'Le portefeuille modèle d\'Horacle Capital.',
      category: 'Portfolio',
      url: '/portfolio',
      date: ''
    }
  ];

  const fullIndex = [...reportsIndex, ...researchIndex, ...pagesIndex];

  return new Response(JSON.stringify(fullIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
