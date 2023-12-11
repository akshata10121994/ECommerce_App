//here we will write code about what is the action type and what payload we have
//to send to the reducer to change the state
//COMPONENT -> ACTION ->[thunk middleware] REDUCER -> STORE
// The action creator's responsibility is to initiate the data fetching operation,
//  and the reducer's responsibility is to update the state based on the
//  fetched data.
import axios from 'axios';
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_REQUEST,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from '../constants/productConstants';

export const getProduct =
  (keyword = '', currentPage = 1, price = [0, 25000], category,ratings=0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });


      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      //yeh jo data aa rha h wo backend ke controller fxn se aa rha h..res.status.json{} me jo bhej rhe h
      //wo data h yeh,yaha se reducer me jayega
     if (category) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}ratings[gte]=${ratings}`;
      }
      const { data } = await axios.get(link);
      console.log(data);
      dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });


    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/v1/products/${id}`);

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearError = async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
