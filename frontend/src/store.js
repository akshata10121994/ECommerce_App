import { createStore, combineReducers, applyMiddleware } from 'redux';
import { productReducer,productDetailsReducer } from './reducers/productReducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import { userReducer,profileReducer, forgotPasswordReducer } from './reducers/userReducer';
import {cartReducer} from './reducers/cartReducer'
const reducer = combineReducers({
  products: productReducer,
  productDetails:productDetailsReducer,
  user:userReducer,
  profile:profileReducer,
  forgotPassword:forgotPasswordReducer,
  cart: cartReducer,
});

const middleware = [thunk];
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],}
}
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
