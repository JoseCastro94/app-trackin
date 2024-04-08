import fs from 'fs'
import hbs from 'handlebars'
import path from "path";

hbs.registerHelper('uppercase', (value) => {
    return value.toUpperCase()
});

hbs.registerHelper('isEquals', (value_1, value_2) => {
    return value_1 === value_2
})

hbs.registerHelper('isEquals', (value_1, value_2) => {
    return value_1 === value_2
})

hbs.registerHelper('hasSerie', (serie) => {
    return serie ? serie : 'N/A'
})

hbs.registerHelper('yerOrNo', (value) => {
    return value ? 'Sí' : 'No'
})

class GenerateTemplatePdf {
    static build = (templateName, data) => {
        let fileHeaderPath = path.join(process.cwd(), 'src/views/templates', 'partials', 'header.hbs');
        const htmlHeader = fs.readFileSync(fileHeaderPath, 'utf-8');
        hbs.registerPartial('header', hbs.compile(htmlHeader))

        let fileFooterPath = path.join(process.cwd(), 'src/views/templates', 'partials', 'footer.hbs');
        const htmlFooter = fs.readFileSync(fileFooterPath, 'utf-8');
        hbs.registerPartial('footer', hbs.compile(htmlFooter))

        let filePath = path.join(process.cwd(), 'src/views/templates', `${templateName}.hbs`);
        const html = fs.readFileSync(filePath, 'utf-8');
        const template = hbs.compile(html);
        return template(data);
    }
}

export default GenerateTemplatePdf
