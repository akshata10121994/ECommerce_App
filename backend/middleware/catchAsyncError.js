module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

  //thefunc is all the async functions which we have written in controller fxn
  //try catch ke liye ye separate function likha h