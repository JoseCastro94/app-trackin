export const sum = (rows, param, field) => {
    let result = [] 
    rows.map(row => {
        let find = result.find(f => f[param] === row[param])
        if (find) {
            find[field] = row[field] + find[field]
        } else {
            let nuevo = {}
            nuevo[param] = row[param]
            nuevo[field] = row[field]
            result.push(nuevo)
        }
        return row
    })
    return result
}