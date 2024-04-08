import Sequelize, {Op} from "sequelize";
import path from "path";
import {unlinkSync} from "fs";
import XLSX from "xlsx";

class Util {
    static pagination = (req) => {
        let { page, limit, filter } = req.query
        if (!page || !limit) {
            return false
        }

        limit = parseInt(limit, 10) || 10;
        page = parseInt(page, 10) || 1;
        filter = filter ? filter.split('and').map(item => item.trim().split(' ')) : []
        console.log('FILTER', filter)
        return {
            offset: (page * limit) - limit,
            limit,
            filter
        }
    }

    static generateWhere = (filter) => {
        return filter.map(item => {
            item[2] = item[2].replace('_', ' ')
            return item
        }).map(item => {
            if (item[1] === 'eq') {
                return Sequelize.where(
                    Sequelize.col(item[0]), item[2]
                )
            }

            if (item[1] === 'lk') {
                return Sequelize.where(
                    Sequelize.col(item[0]), {
                        [Op.like]: `%${item[2]}%`
                    }
                )
            }

            if (item[1] === 'notIn') {
                return Sequelize.where(
                    Sequelize.col(item[0]), {
                        [Op.notIn]: item[2].split(',')
                    }
                )
            }
        })
    }

    static readExcel = async ({attached}) => {
        const filePath = path.join(process.cwd(), 'src', 'public', 'import-files', attached.name)
        await Promise.all([attached.mv(filePath)])
        const workbook = XLSX.readFile(filePath)
        const sheetNames = workbook.SheetNames
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
        console.log('filePath', filePath)
        unlinkSync(filePath)
        return data
    }

    static readLoopExcel = async ({attached}) => {
        const filePath = path.join(process.cwd(), 'src', 'public', 'import-files', attached.name)
        await Promise.all([attached.mv(filePath)])
        const workbook = XLSX.readFile(filePath)
        const sheetNames = workbook.SheetNames
        const data = []
        for(const sheetName of sheetNames) {
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
            data.push(sheet)
        }
        unlinkSync(filePath)
        return data
    }
}

export default Util
