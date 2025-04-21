import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
    const dir = path.join(process.cwd(), 'public', 'art');
    const txtPath = path.join(process.cwd(), 'public', 'art_link.txt');

    try {
        const files = await fs.readdir(dir);
        const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png')).slice(0, 8);

        const linksText = await fs.readFile(txtPath, 'utf8');
        const links = linksText.split('\n').map(link => link.trim());

        return NextResponse.json({ images, links });
    } catch (err) {
        console.error(err);
        return new NextResponse('Error reading files', { status: 500 });
    }
}
