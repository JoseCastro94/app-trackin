import * as FileSaver from 'file-saver'
import XLSX from  'sheetjs-style'

export const validateEmail = (email) => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexEmail.test(email)
}

export const validarFile = (event) => {
    const response = {
        status: false,
        success: false,
        message: 'No tiene archivos.',
        severity: 'error'
    }

    if (!event.target.files) return response
    const file = event.target.files[0]
    if (file.size > 4194304) {
        response.message = 'Se excedió el límite permitido'
        return response
    }

    let formData = new FormData()
    formData.append('attached', file)
    response.status = true
    response.data = formData
    return response
}

export const downloadExcel = async (json, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    const fileExtension = '.xlsx'

    const ws = XLSX.utils.json_to_sheet(json)

    ws["!cols"] = Object.keys(json[0]).map(el => {
        return json.reduce((acc, cur) => Math.max(acc, !cur[el] ? el.length : cur[el].toString().length), el.length)
    }).map(item => {
        return { wch: item > 10 ? item + 5 : item }
    })

    const wb = { Sheets: { data: ws }, SheetNames: ['data']}
    const buffer = XLSX.write(wb, {bookType: "xlsx", type: "array"})
    const data = new Blob([buffer], {type: fileType})
    FileSaver.saveAs(data, fileName + fileExtension)
}

export const saveFileAs = (file, fileName) => {
    FileSaver.saveAs(file, fileName)
}

export const openNewTab = (blob, name) => {
    let url = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
}
