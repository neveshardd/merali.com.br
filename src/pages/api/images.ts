
// src/pages/api/images.ts
import type { APIRoute } from 'astro';
import { getAllImages } from '../../db/media_queries';

export const GET: APIRoute = async () => {
  const images = await getAllImages();
  return new Response(JSON.stringify(images), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
