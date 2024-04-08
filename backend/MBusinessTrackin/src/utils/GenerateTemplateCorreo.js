import fs from 'fs'
import hbs from 'handlebars'
import path from "path";

hbs.registerHelper('hasSerie', (serie) => {
    return serie ? serie : 'N/A'
})

class GenerateTemplateCorreo {
    static build = (templateName, data) => {
        let filePath = path.join(process.cwd(), 'src/views/correo', `${templateName}.hbs`);
        const html = fs.readFileSync(filePath, 'utf-8');
        const template = hbs.compile(html);
        return template(data);
    }
}

export default GenerateTemplateCorreo
