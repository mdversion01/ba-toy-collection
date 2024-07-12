import React, { useState, useEffect } from 'react';
import moment from 'moment';

const AddedToy = ({ date }) => {

  let expDate = moment(date)
    .add(30, 'd') //replace 5 with number of days you want to add
    .toDate(); //convert it to a Javascript Date Object if you like

  let currentDate = moment().toDate();

  // Using the date that was added to the DB, add 5 days to it and compare it to the current date. If the current date is less than the expiration date, show the new item icon.
  const [addedItem, setAddedItem] = useState(false);

  useEffect(() => {
    if (currentDate < expDate) {
      setAddedItem(true);
    }
  }, [currentDate, expDate]);

  return (
    <>
      {addedItem && (
        <div className="new-item">
          <i className="fa fa-check" aria-hidden="true" />
        </div>)}
    </>
  );
}


export default AddedToy;
