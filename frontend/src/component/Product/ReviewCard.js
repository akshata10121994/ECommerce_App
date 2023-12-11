import React from 'react'
import profilePng from '../../images/Profile.png';
import ReactStars from 'react-rating-stars-component';
const mongoose = require('mongoose');
const objectId = new mongoose.Types.ObjectId();

console.log(objectId);

const ReviewCard = ({review}) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    activeColor:'tomato'
  };
  
  return (
    <div className='reviewCard'>
        <img src = {profilePng} alt='User'/>
        <p>{review.name}</p>
      <ReactStars {...options}/>
      <span className='reviewCardComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard
