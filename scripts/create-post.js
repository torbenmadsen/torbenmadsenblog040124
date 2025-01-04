#!/usr/bin/env node

import { createInterface } from 'readline/promises';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

async function createPost() {
  try {
    const title = await rl.question('Post title: ');
    const description = await rl.question('Post description: ');
    const tags = (await rl.question('Tags (comma-separated): ')).split(',').map(tag => tag.trim());
    const image = await rl.question('Image URL (press Enter for default): ') || 
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop';
    const youtube = await rl.question('YouTube video ID (optional): ');

    const slug = await slugify(title);
    const date = await getCurrentDate();
    
    const content = `---
title: "${title}"
description: "${description}"
pubDate: ${date}
image: "${image}"
tags: ${JSON.stringify(tags)}${youtube ? `\nyoutube: "${youtube}"` : ''}
---

${youtube ? `\nimport YouTube from '../../components/YouTube.astro';\n` : ''}
# ${title}

${description}

${youtube ? `\n<YouTube id={frontmatter.youtube} title="${title}" />\n` : ''}
## Content Goes Here

Start writing your blog post here...
`;

    const filePath = join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    await writeFile(filePath, content);

    console.log(`\n✅ Blog post created successfully: ${filePath}`);
    console.log('\nYou can now edit the file to add your content!');

  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    rl.close();
  }
}

console.log('📝 Create a New Blog Post\n');
createPost();
