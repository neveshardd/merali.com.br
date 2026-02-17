
export interface CRMProject {
    id: string;
    title: string;
    description: string | null;
    mainImage: string | null;
    category?: string;
    featured?: boolean;
    images: { url: string }[];
    createdAt: string;
    updatedAt: string;
}

export interface FrontendProject {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    year: string;
    location: string;
    area: string;
    images: string; // JSON string of string[]
    featured: boolean;
    createdAt: Date;
    // visual props
    image?: string;
    size?: string;
    position?: string;
}


const CRM_API_URL = import.meta.env.CRM_API_URL || 'http://localhost:3000/api';
const CRM_BASE_URL = CRM_API_URL.replace('/api', '');

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // decompose string to replace accents
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/[^\w\-]+/g, '') // remove all non-word chars
        .replace(/\-\-+/g, '-') // replace multiple - with single -
        .replace(/^-+/, '') // trim - from start
        .replace(/-+$/, ''); // trim - from end
}

export async function getProjectsFromCRM(): Promise<FrontendProject[]> {
    try {
        const res = await fetch(`${CRM_API_URL}/projects`);
        
        if (!res.ok) {
            console.error(`Failed to fetch projects from CRM: ${res.status} ${res.statusText}`);
            return [];
        }

        const data: CRMProject[] = await res.json();

        return data.map(p => {
            // Combine mainImage and other images
            const allImages: string[] = [];
            if (p.mainImage) allImages.push(p.mainImage);
            if (p.images && Array.isArray(p.images)) {
                p.images.forEach(img => {
                    if (img.url) allImages.push(img.url);
                });
            }

            // Remove duplicates
            const uniqueImages = [...new Set(allImages)];

            // Ensure full URLs if they are relative
            const finalImages = uniqueImages.map(img => {
                if (img.startsWith('http')) return img;
                if (img.startsWith('/')) return `${CRM_BASE_URL}${img}`;
                return img;
            });

            return {
                id: p.id,
                title: p.title,
                slug: slugify(p.title),
                category: p.category || 'Arquitetura',
                description: p.description || '',
                year: new Date(p.createdAt).getFullYear().toString(),
                location: '', // Default
                area: '', // Default
                images: JSON.stringify(finalImages),
                featured: !!p.featured,
                createdAt: new Date(p.createdAt)
            };
        });
    } catch (error) {
        console.error('Error fetching projects from CRM:', error);
        return [];
    }
}

export async function getProjectBySlugFromCRM(slug: string): Promise<FrontendProject | null> {
    const projects = await getProjectsFromCRM();
    return projects.find(p => p.slug === slug) || null;
}
