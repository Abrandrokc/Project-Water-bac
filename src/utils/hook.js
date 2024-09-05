export const mongoError = (error, data, next) => {
    error.status = 400
 next()
 }
export const mongooseSaveError = (error, data, next)=> {
    const {name, code} = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    next();
}

export const setUpdateSettings =  function(next) {
   
    this.setOptions({
        new: true,
        runValidators: true
    });
    next();

    

};