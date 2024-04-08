import GenerateTemplatePdf from "./GenerateTemplatePdf.js";
import path from "path";
import pdf from "html-pdf";
import hbs from "handlebars";

hbs.registerHelper('uppercase', (value) => {
    return value.toUpperCase()
});

hbs.registerHelper('isEquals', (value_1, value_2) => {
    return value_1 === value_2
})

hbs.registerHelper('hasSerie', (serie) => {
    return serie ? serie : 'N/A'
})

hbs.registerHelper('yerOrNo', (value) => {
    return value ? 'Sí' : 'No'
})

class GeneratePdf {
    static build = (body, res, templateName) => {
        const imagePath = path.join(process.cwd(), 'src', 'public', 'logo.jpeg')
        body.logo = `file:///${imagePath}`
        console.log(body.logo)
        const contenidoHtml = GenerateTemplatePdf.build(templateName, body)

        pdf.create(contenidoHtml, {
            localUrlAccess: true,
            format: 'A4',
            header: {
                height: "20mm",
                contents: ``
            },
            footer: {
                height: "28mm",
                contents: ''
            }
        }).toBuffer((error, buffer) => {
            if (error) {
                res.end("Error creando PDF: " + error)
            } else {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=demo-file.pdf");
                const base64Attachment = buffer.toString("base64");
                res.send(base64Attachment)
            }
        });
    }
}

export default GeneratePdf