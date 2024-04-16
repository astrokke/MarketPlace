
import React from 'react';
import { ToyInterface } from '../interfaces/ToyInterfaces';

interface BasketProps {
  toys: ToyInterface[];
  onRemoveFromBasket: (id: number) => void;
}

const Basket: React.FC<BasketProps> = ({ toys, onRemoveFromBasket }) => {
  const totalPrice = toys.reduce((acc, toy) => acc + toy.price, 0);

  return (
    <div>
      <h2>Panier</h2>
      <ul>
        {toys.map((toy, index) => (
          <li key={toy.id + '-' + index}>
            {toy.label} - {toy.price}€
            <button onClick={() => onRemoveFromBasket(toy.id)}>Retirer</button>
          </li>
        ))}
      </ul>
      <p>Total: {totalPrice}€</p>
    </div>
  );
};

export default Basket;
