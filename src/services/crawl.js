function htmlToMarkdown(html) {
  return (
    html
      // Convert <h2> to ## heading
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, content) => `## ${stripTags(content)}\n`)
      // Convert <p> to paragraph
      .replace(/<p[^>]*>(.*?)<\/p>/gis, (_, content) => `${stripTags(content)}\n`)
      // Convert <br> to line break
      .replace(/<em[^>]*>(.*?)<\/em>/gi, (_, content) => `*${stripTags(content)}*`)
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, (_, content) => {
        const strippedContent = stripTags(content);
        return strippedContent ? `**${strippedContent}**\n` : '';
      })
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<span[^>]*>(.*?)<\/span>/gi, (_, content) => `${stripTags(content)}\n`)
      .replace(/<div[^>]*>(.*?)<\/div>/gi, (_, content) => `${stripTags(content)}\n`)
      // Convert <img ...> to ![alt](src)
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, (_, content) => `- ${stripTags(content)}\n`)
      .replace(
        /<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi,
        (_, alt, src) => `![${alt}](${src})\n`,
      )
      // Clean up any multiple new lines
      .replace(/\n{2,}/g, '\n\n')
      .trim()
  );
}

function stripTags(str) {
  if (typeof str !== 'string') return '';
  let text = str;

  // Decode HTML entities using a textarea element (robust for browser environments)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  text = textarea.value;

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  return text.trim();
}

function crawl() {
  return {
    category: 'Gói khám Khác',
    titleImage: document.querySelector('.wrapper-image>img').src,
    title: document.querySelector('h2').innerText,
    description: document.querySelector('.clinic-summary').innerText || ' ',
    price: parseInt(
      document.querySelector('.clinic-price').innerText.split('đ')[0].replaceAll(',', ''),
    ),
    tests: [],
    content: htmlToMarkdown(document.querySelector('.wrapper-description').innerHTML)
      .replaceAll('Đa khoa Diamond', '')
      .split('<table')[0]
      .replace('Diamond', '')
      .replaceAll('\\n\\n</li>', '')
      .replaceAll(`<li dir=\\"ltr\\" aria-level=\\"1\\">\\n`, ''),
    condition:
      htmlToMarkdown(document.querySelector('.wrapper-description').innerHTML)
        .replaceAll('Diamond', '')
        .split('Điều kiện sử dụng gói khám:')[1] || ' ',
    maxSlotPerPeriod: 10,
    bookingOption: document.querySelector('h3').innerText,
  };
}

JSON.stringify(crawl());
