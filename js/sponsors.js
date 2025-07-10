async function fetchSponsors() {
  const url = 'content/sponsors.json';

  try {

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const namespace = 'sponsors'; // Namespace for the CMS data
    
    // Iterate over data object keys and replace [data-cms] instances in the CMS.
    Object.keys(data).forEach(key => {
      if (key === 'content') return; // skip markdown content
      const elements = document.querySelectorAll(`[data-cms="${namespace}.${key}"]`);
      elements.forEach(el => {
      if (el.tagName === 'IMG') {
        el.src = data[key]; // Assuming value is a URL for images
      } else if (el.tagName === 'A') {
        el.href = data[key]; // For links
      } else {
        el.innerHTML = nl2br(data[key]); // For text content
      }
      });
    });



  } catch (err) {
    console.error('Failed to fetch sponsors content:', err);
  }
}

function nl2br(str) {
  return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
}

fetchSponsors();