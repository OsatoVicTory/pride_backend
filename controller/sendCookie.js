exports.sendCookie = (res, data) => {
    res.cookie("PRIDE_TOKEN", data, {
        httpOnly: true,
        maxAge: Date.now() + 86400000,
        sameSite: 'none',
        secure: false
    })
}