function hasAccess(accessLevel)
{
    return function(req, res, next)
    {        
        if (req.user && req.user.hasAccess(accessLevel))
            return next()
        
        return res.status(401).json(
                {
                    success: false,
                    error: 'Unauthorized'
                })
    }
}

module.exports =
{
    hasAccess: hasAccess
}