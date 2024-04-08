import GenerateTemplatePdf from "../utils/GenerateTemplatePdf.js";
import path from "path"
import puppeteer from 'puppeteer'

const generatePdf = async (body, templateName) => {
    const imagePath = path.join(process.cwd(), 'src', 'public', 'logo.jpeg')
    console.log('imagePath', imagePath)
    body.logo = `file:///${imagePath}`
    console.log(body.logo)
    const contenidoHtml = GenerateTemplatePdf.build(templateName, body)

    let args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
    ]

    const browser = await puppeteer.launch({
        args: args,
        headless: true,
        executablePath: '/usr/bin/google-chrome',
    })
    const page = await browser.newPage()
    await page.setContent(contenidoHtml, {
        waitUntil: 'domcontentloaded'
    })

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: 0, right: 0, bottom: 0, left: 0,
        }
    })

    await browser.close()
    return pdfBuffer;
}

export const generate = async (body, res, templateName, name = 'file') => {
    const pdfBuffer =  await generatePdf(body, templateName)

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${name}.pdf`);
    res.send(pdfBuffer)
}

export const generateAttachment = async (body, templateName) => {
    const buffer = await generatePdf(body, templateName);
    return buffer.toString('base64')
}
