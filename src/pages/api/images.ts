
// src/pages/api/images.ts
import type { APIRoute } from 'astro';
import { getProjectsFromCRM } from '../../lib/crm';

export const GET: APIRoute = async () => {
  try {
    const projects = await getProjectsFromCRM();
    const allImages: { url: string; filename: string }[] = [];
    const seenUrls = new Set<string>();

    projects.forEach(p => {
      try {
        // In CRM projects, images is a JSON string of strings
        const images = JSON.parse(p.images || '[]');
        if (Array.isArray(images)) {
          images.forEach(url => {
            if (url && !seenUrls.has(url)) {
              seenUrls.add(url);
              allImages.push({ 
                url, 
                filename: url.split('/').pop() || 'image' 
              });
            }
          });
        }
      } catch (e) {
        console.error('Error parsing project images for API:', e);
      }
    });

    return new Response(JSON.stringify(allImages), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API Images error:', error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
