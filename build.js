import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { writeFileSync } from 'fs';

const url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCTAoreBHN6LlXNrAbmRKhQ';

try {
  const response = await fetch(url);
  const xml = await response.text();

  const result = await parseStringPromise(xml, { explicitArray: false });
  const entries = result.feed.entry;

  const ret = entries.map(row => {
    const ytId = row.id.substring(row.id.lastIndexOf(':') + 1);
    return {
      title: row.title,
      link: `https://www.youtube.com/watch?v=${ytId}`,
      published: row.published,
      updated: row.updated,
      id: row.id,
      youtube_id: ytId,
    };
  });

  // ✅ Write to podcasts.json in root
  writeFileSync('./podcasts.json', JSON.stringify(ret, null, 2), 'utf8');
  console.log('✅ podcasts.json written to root');
} catch (err) {
  console.error('❌ Error fetching or parsing:', err);
  process.exit(1);
}
