import xl from 'excel4node';
import moment from 'moment';

const autofitColumns = (json, worksheet) => {
    let objectMaxLength = [];
    let j = {};
    for (let key in json[0]) {
        j[key] = key;
    }
    json.push(j);
    json.map(jsonData => {
        Object.entries(jsonData)
            .map(([, v], idx) => {
                let columnValue = v;
                if (columnValue) {
                    if (columnValue.length) {
                        objectMaxLength[idx] = objectMaxLength[idx] >= columnValue.length ? objectMaxLength[idx] : columnValue.length;
                    }
                }
            })
    })
    objectMaxLength.forEach((w, i) => {
        worksheet.column(i + 1).setWidth(w);
    });
};

/**
 * Generar libro excel
 * @param {Array<Object>} data Datos del libro
 * @param {String} name Nombre del libro
 * @param {String} type Tipo de documento a generar
 * @returns {Promise<Buffer>} Binario del archivo
 */
export const make_book = (data) => {
    var wb = new xl.Workbook();
    let TitleStyle = wb.createStyle({
        font: {
            color: 'FFFFFF',
            size: 12,
            bold: true
        },
        fill: {
            type: 'pattern',
            bgColor: '000064',
            fgColor: '000064',
            patternType: 'solid'
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        border: { // §18.8.4 border (Border)
            left: {
                style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: '000000' // HTML style hex value
            },
            right: {
                style: 'thin',
                color: '000000'
            },
            top: {
                style: 'thin',
                color: '000000'
            },
            bottom: {
                style: 'thin',
                color: '000000'
            }
        }
    });

    let NumberStyle = wb.createStyle({
        font: {
            color: '000000',
            size: 12,
        },
        numberFormat: '0',
        border: { // §18.8.4 border (Border)
            left: {
                style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: '000000' // HTML style hex value
            },
            right: {
                style: 'thin',
                color: '000000'
            },
            top: {
                style: 'thin',
                color: '000000'
            },
            bottom: {
                style: 'thin',
                color: '000000'
            }
        }
    });

    let style = wb.createStyle({
        font: {
            color: '000000',
            size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        border: { // §18.8.4 border (Border)
            left: {
                style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: '000000' // HTML style hex value
            },
            right: {
                style: 'thin',
                color: '000000'
            },
            top: {
                style: 'thin',
                color: '000000'
            },
            bottom: {
                style: 'thin',
                color: '000000'
            }
        }
    });

    let DateStyle = wb.createStyle({
        font: {
            color: '000000',
            size: 12,
        },
        numberFormat: 'dd/mm/yyyy',
        border: { // §18.8.4 border (Border)
            left: {
                style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: '000000' // HTML style hex value
            },
            right: {
                style: 'thin',
                color: '000000'
            },
            top: {
                style: 'thin',
                color: '000000'
            },
            bottom: {
                style: 'thin',
                color: '000000'
            }
        }
    });

    for (const sheet of data) {
        let ws = wb.addWorksheet(sheet.name)
        create_sheet({
            list: sheet.list,
            ws: ws,
            TitleStyle: TitleStyle,
            DateStyle: DateStyle,
            style: style,
        })
    }
    return wb.writeToBuffer();
};

const create_sheet = ({
    list = [],
    ws,
    TitleStyle,
    DateStyle,
    style,
}) => {
    let i = 1;
    let c = 1;
    for (let key in list[0]) {
        ws.cell(i, c).string(key).style(TitleStyle);
        c++;
    }
    i = 2;
    list.forEach(row => {
        c = 1;
        for (let key in row) {
            let d = row[key];
            try {
                let m = moment(String(d));
                if (typeof d === 'string') {
                    ws.cell(i, c).string(String(d)).style(style);
                } else if (typeof d === 'number') {
                    ws.cell(i, c).string(d).NumberStyle(style);
                } else {
                    try {
                        if (m.isValid()) {
                            ws.cell(i, c).date(m.toDate()).style(DateStyle);
                        } else {
                            ws.cell(i, c).string(String(d)).style(style);
                        }
                    } catch {
                        console.log(`error en la validacion en ${i} y ${c}`)
                        ws.cell(i, c).string(String(d)).style(style);
                    }
                }
            } catch (ex) {
                console.log(`error en la iniciación en ${i} y ${c}`)
                ws.cell(i, c).string(String(d)).style(style);
            }
            c++;
        }
        i++;
    });
    autofitColumns(list, ws);
}