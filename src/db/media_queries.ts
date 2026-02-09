
import fs from 'fs/promises';
import path from 'path';
import { getProjects } from './queries';

// Define a type for our image structure
export interface ImageFile {
    url: string;
    filename: string; // The file name without the path
    projectId?: string; // ID of the project this image belongs to, if any
    projectTitle?: string;
}

export const getAllImages = async (): Promise<ImageFile[]> => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
        await fs.access(uploadDir);
    } catch {
        return [];
    }
    
    // 1. Get all files from the uploads directory
    const files = await fs.readdir(uploadDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    
    // 2. Get all projects to map images to projects
    const projects = await getProjects();
    
    // 3. Map files to detailed objects
    const images: ImageFile[] = imageFiles.map(filename => {
        const url = `/uploads/${filename}`;
        
        // Find which project uses this image
        let associatedProject = projects.find(p => {
            try {
                // Handle JSON array of strings
                const projectImages: string[] = JSON.parse(p.images || '[]');
                return Array.isArray(projectImages) && projectImages.includes(url);
            } catch {
                // Handle single string fallback
                return p.images === url;
            }
        });

        // Also check if it's just a raw string in the DB (legacy or single image)
        if (!associatedProject) {
             associatedProject = projects.find(p => p.images && p.images.includes(url));
        }

        return {
            url,
            filename,
            projectId: associatedProject ? associatedProject.id : undefined,
            projectTitle: associatedProject ? associatedProject.title : undefined
        };
    });

    return images;
};

export const deleteImageFile = async (filename: string) => {
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    try {
        await fs.unlink(filepath);
        return true;
    } catch (e) {
        console.error("Error deleting file:", e);
        return false;
    }
};
