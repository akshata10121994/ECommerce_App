class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter(){
    const queryStrCopy = {...this.queryStr}
    // console.log(queryStrCopy);
    // removing some fields from queeryStr
    const removeFields = ['keyword','page','limit']
    removeFields.forEach((key)=>{ delete queryStrCopy[key]})
    console.log(queryStrCopy);
    
    //filter for price
    let queryStr = JSON.stringify(queryStrCopy)
     queryStr =   queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
     this.query = this.query.find(JSON.parse(queryStr))
     return this;
  }
   
  //function for pagination ie ek page pr kitne product dikhne chahiye
  pagination(resultPerPage){
     const currentPage = Number(this.queryStr.page) || 1;
     const skip = resultPerPage * (currentPage-1);
     this.query = this.query.limit(resultPerPage).skip(skip)
     return this;


  }


}

module.exports = ApiFeatures;