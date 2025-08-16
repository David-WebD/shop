import * as cheerio from 'cheerio';

let cachedOffers = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

 async function getOffers(){

    const now = Date.now();

    if (cachedOffers && (now - cacheTimestamp < CACHE_DURATION)) {
        return cachedOffers;
    }

    const res = await fetch('https://www.premier-stores.co.uk/special-offers');
    const html = await res.text();
    const $ = cheerio.load(html);


    const offers = [];
    let duration = '';
  const footerText = $("footer").text().trim();
  duration = footerText.match(/^(.*?\.)/)?.[1] || 'No duration specified';

    // Select the offer elements

   $("ul.full li.col-md-3").each((_, el) => {
    const title = $(el).find("h3").text().trim();
    const link = $(el).find("a").first().attr("href");
    const img = $(el).find("img").attr("src");

    offers.push({
      id: _,
      title,
      duration: duration,
      link: link ? `https://www.premier-stores.co.uk${link}` : null,
      image: img ? `https://www.premier-stores.co.uk${img}` : null,
        });

    });


    cachedOffers = offers;
    cacheTimestamp = now;
    return offers;
}

export default getOffers;



