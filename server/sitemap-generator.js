var fs = require('fs');
const Course = require("./api/course/course.model");

async function generateSitemap()
{
    let content = getStaticContent();
    
    let courses = await Course.find({ hidden: {$ne: true} });
    if (courses == null)
        return;
    
    courses.forEach((course, i) =>
    {
        content += `<url><loc>https://www.appcademos.com/cursos-ingles/curso/${course.id}</loc><changefreq>daily</changefreq></url>`;
    });
    
    content += `\n</urlset>`;
    
    fs.writeFile('public/sitemap.xml', content.replace(/\r?\n|\r| {4}/g,''), function (err)
    {
        if (err) return console.log(err);
        console.log('Sitemap generated!');
    });
}

function getStaticContent()
{
    return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>https://www.appcademos.com/</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/blog/</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cookie-policy/</loc>
</url>
<url>
    <loc>https://www.appcademos.com/estudio-personalizado/</loc>
</url>

<url>
    <loc>https://www.appcademos.com/cursos-ingles/first-certificate</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/advanced</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/toefl</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/ielts</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/toeic</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/proficiency</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/nivel-b1</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/nivel-b2</loc>
    <changefreq>weekly</changefreq>
</url>
<url>
    <loc>https://www.appcademos.com/cursos-ingles/nivel-c1</loc>
    <changefreq>weekly</changefreq>
</url>`;
}

module.exports = generateSitemap;