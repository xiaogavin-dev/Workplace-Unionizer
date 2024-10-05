const getUnions = (req, res, next) => {
    console.log("we hit getUnions endpoint")
    return res.status(200).json({
        status: 'success',
        message: 'hit unions'
    })
}
module.exports = { getUnions }