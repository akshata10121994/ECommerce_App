import React, { Fragment, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import './ProductDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { clearError, getProductDetails } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
// import { Rating } from "@material-ui/lab";
import ReactStars from 'react-rating-stars-component';
import ReviewCard from './ReviewCard.js';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import { addItemsToCart } from '../../actions/cartAction.js';


const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert = useAlert()

  const { loading, product, error } = useSelector(
    (state) => state.productDetails,
  );

  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearError())
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id,alert,error]);

  const options = {
    size: 'large',
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity,setQuantity] = useState(1)

  const decreaseQuantity = ()=>{
    if(quantity<=1)
      return
     const qty = quantity-1
   setQuantity(qty)
  }

  const increaseQuantity = ()=>{
    if(product.Stock<=quantity) return
    const qty = quantity+1
    setQuantity(qty)
  }

  const addToCartHandler =()=>{
    dispatch(addItemsToCart(id,quantity))
    alert.success("Item Added To Cart");
  }


  return (
    <Fragment>
    {loading ? <Loader/> : (
      <Fragment>
      <div className="ProductDetails">
        <div>
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImage"
                  key={item.url}
                  src={item.url}
                  alt={`${i} slide`}
                />
              ))}
          </Carousel>
        </div>
        <div>
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className="detailsBlock-2">
            {/* <Rating {...options} /> */}
            <ReactStars {...options} />
            <span className="detailsBlock-2-span">
              {' '}
              ({product.numOfReviews} Reviews)
            </span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <input value={quantity} readOnly type="number" />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
            </div>
            <p>
              Status:
              <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                {product.Stock < 1 ? 'OutOfStock' : 'InStock'}
              </b>
            </p>
          </div>

          <div className="detailsBlock-4">
            Description : <p>{product.description}</p>
          </div>
          <button className="submitReview">Submit Review</button>
        </div>
      </div>
      <h3 className="reviewsHeading">REVIEWS</h3>
    {product.reviews && product.reviews[0] ? (
     <div className='reviews'>
       {product.reviews && product.reviews.map((review)=>(
        <ReviewCard review = {review}/>
        ))}
     </div>
    ) : (
      <p className='noReviews'>No reviews Yet</p>
    )}
    </Fragment>
    )}
</Fragment>
  );
};

export default ProductDetails;
