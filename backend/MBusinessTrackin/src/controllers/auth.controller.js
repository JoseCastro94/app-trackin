
export const validate = async (req, res) => {
    const {
        options
    } = req.headers.user

    const {
        code
    } = req.body

    if (options.includes(code)) {
        return res.status(200).json({ status: true });
    } else {
        return res.status(403).json({ status: false });
    }
}

export const isAuthorized = async (req, res) => {
    return res.status(200).json({ status: true })
}