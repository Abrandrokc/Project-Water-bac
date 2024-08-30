 const  notFoundHandler = (req, res) => {
        res.status(404).json({
            status: 404 ,
            masege: "Route not found",
        })
    }
export default  notFoundHandler
