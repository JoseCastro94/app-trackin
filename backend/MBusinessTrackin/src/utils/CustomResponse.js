class CustomResponse {
    static successResponse = (res, data) => {
        res.status(200).json(data)
    }

    static deletedResponse = (res, args = {}) => {
        const response = {
            success: true,
            title: args.title || '',
            message: args.message || 'Eliminación exitosa',
            severity: 'success',
            data: args.data || null
        }
        res.status(200).json(response)
    }

    static createdResponse = (res, args = {}) => {
        const response = {
            success: true,
            title: args.title || '',
            message: args.message || 'Registro exitoso',
            severity: 'success',
            data: args.data || null
        }
        res.status(201).json(response)
    }

    static infoResponse = (res, args = {}) => {
        const response = {
            success: false,
            title: args.title || 'Opss!!',
            message: args.message || '',
            severity: 'info',
            data: args.data || null
        }
        res.status(200).json(response)
    }

    static errorResponse = (res, error) => {
        console.log('*** ERROR ***', error)
        console.log('*** ERROR ***', error.name)
        console.log('*** ERROR ***', error.message)
        const response = {
            success: false,
            title: 'Error!!',
            message: 'Ha ocurrido un error, consulte con el administrador!',
            // name: error.name,
            // description: error.message,
            severity: 'error',
        }

        res.status(500).json(response)
    }
}

export default CustomResponse
