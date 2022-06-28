import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Check out these EPIC responsive cards!</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/img-9.jpg"
              text="check this card out, very simple and effective."
              label="Adventure"
              path="/services"
            />
            <CardItem
              src="images/img-8.jpg"
              text="the more cards added, the better the formatting."
              label="Adventure"
              path="/services"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="images/img-7.jpg"
              text="the cards are seperated using ul tags."
              label="Adventure"
              path="/services"
            />
            <CardItem
              src="images/img-6.jpg"
              text="these three cards take up the same space as the top two."
              label="Adventure"
              path="/services"
            />
            <CardItem
              src="images/img-5.jpg"
              text="cards can be used to display products or services etc."
              label="Adventure"
              path="/services"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
