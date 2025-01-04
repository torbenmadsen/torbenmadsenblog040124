import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const POST: APIRoute = async ({ request, redirect }) => {
  // Check authentication
  const cookies = request.headers.get('cookie');
  if (!cookies?.includes('admin-access=true')) {
    return redirect('/admin');
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());
    const youtube = formData.get('youtube') as string;
    const content = formData.get('content') as string;

    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0];

    const postContent = `---
title: "${title}"
description: "${description}"
pubDate: ${date}
image: "${image}"
tags: ${JSON.stringify(tags)}${youtube ? `\nyoutube: "${youtube}"` : ''}
---

${youtube ? `\nimport YouTube from '../../components/YouTube.astro';\n` : ''}
${content}
`;

    const filePath = join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    await writeFile(filePath, postContent);

    return redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response('Error creating post', { status: 500 });
  }
};
