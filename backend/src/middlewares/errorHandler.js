
const errorHandler = (err, req, res, next) => {
    console.log("error from errorHandler :",err.stack);
    res.status(500).json({
        status:500,
        success: false,
        message:"Something went wrong",
        error: err?.detail
    })
}
module.exports = errorHandler;