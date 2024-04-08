import menu from './menu'
import home from './home'

const generate = (data) => {
    let rst = {
        items: [home]
    }

    data.forEach(item => {
        rst.items.push(menu(item))
    })

    return rst
}

export default generate