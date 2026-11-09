// Loads CMS-managed JSON from content/<namespace>.json and fills matching
// [data-cms="<namespace>.<key>"] elements. Elements marked
// [data-cms-show="<namespace>.<key>"] start hidden and are revealed only
// when that field has a value.
const namespaces = ['sponsors', 'job-support-circle'];

async function loadCmsContent(namespace) {
  const url = `content/${namespace}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    Object.keys(data).forEach(key => {
      if (key === 'content') return; // skip markdown content
      const value = data[key];

      document.querySelectorAll(`[data-cms="${namespace}.${key}"]`).forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = value; // Assuming value is a URL for images
        } else if (el.tagName === 'A') {
          el.href = value; // For links
        } else {
          el.innerHTML = nl2br(value ?? ''); // For text content
        }
      });

      const hasValue = typeof value === 'string' ? value.trim() !== '' : Boolean(value);
      document.querySelectorAll(`[data-cms-show="${namespace}.${key}"]`).forEach(el => {
        el.classList.toggle('hidden', !hasValue);
      });
    });
  } catch (err) {
    console.error(`Failed to fetch ${namespace} content:`, err);
  }
}

function nl2br(str) {
  return String(str).replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
}

namespaces.forEach(loadCmsContent);
