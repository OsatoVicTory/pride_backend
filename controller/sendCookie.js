exports.sendCookie = (res, data) => {
    res.cookie("PRIDE_TOKEN", data, {
        httpOnly: true,
        maxAge: 2680000000,
        sameSite: 'none',
        secure: true,
        domain: 'pride-dot-app.netlify.app'
    })
}
