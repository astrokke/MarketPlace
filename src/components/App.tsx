/** @format */


import React, { useState, useEffect } from "react";
import ToyForm from "./ToyComponent";
import Basket from "./basket";
import { ToyInterface } from "../interfaces/ToyInterfaces";
import "../style/App.css";
const App = () => {
  const [toys, setToys] = useState<ToyInterface[]>([]);
  const [basket, setBasket] = useState<ToyInterface[]>([]);
  

  const loadBasketFromServer = () => {
    const localStorageBasket = localStorage.getItem("basket");
    if (localStorageBasket) {
      setBasket(JSON.parse(localStorageBasket) as ToyInterface[]);
    } else {
      fetch("http://localhost:3001/panier")
        .then((response) => response.json())
        .then((basketItems: { id: number }[]) => {
          const loadedBasket = basketItems
            .map((basketItem) => {
              const toy = toys.find((toy: ToyInterface) => toy.id === basketItem.id);
              if (toy) {
                return toy;
              }
              return null;
            })
            .filter((toy) => toy !== null) as ToyInterface[];
          setBasket(loadedBasket);
        })
        .catch((error) => console.error("Erreur lors de la récupération du panier depuis le serveur:", error));
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/articles")
      .then((response) => response.json())
      .then((loadedToys: ToyInterface[]) => {
        setToys(loadedToys);
        loadBasketFromServer(); 
      })
      .catch((error) => console.error("Erreur lors de la récupération des données:", error));
  }, []);

  const handleToySubmit = (toy: ToyInterface) => {
    fetch("http://localhost:3001/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toy),
    })
      .then((response) => response.json())
      .then((newToy) => setToys([...toys, newToy]));
  };

  const handleAddToBasket = (toyId: number) => {
    const toyToAdd = toys.find((toy) => toy.id === toyId);
    if (toyToAdd && !basket.some((basketItem) => basketItem.id === toyId)) {
      const updatedBasket = [...basket, toyToAdd];
      setBasket(updatedBasket);
      localStorage.setItem("basket", JSON.stringify(updatedBasket));

      fetch("http://localhost:3001/panier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: toyId }),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Erreur lors de l'ajout de l'article au panier sur le serveur:", error));
    }
  };

  const handleRemoveFromBasket = (toyId: number) => {
    const updatedBasket = basket.filter((toy) => toy.id !== toyId);
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
    console.log(toyId)
    fetch(`http://localhost:3001/panier/${toyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .catch((error) => console.error("Erreur lors de la suppression de l'article du panier sur le serveur:", error));
  };
  

  return (
    <div className="app-container">
      <div className="basket-container">
        <Basket toys={basket} onRemoveFromBasket={handleRemoveFromBasket} />
      </div>
      <div className="content-container">
        <h1>Marché de Jouets</h1>
        <ToyForm onSubmit={handleToySubmit} />
        <div className="list-container">
          <h2 className="H2">Liste des Jouets</h2>
          <ul className="ul-container">
            {toys.map((toy) => (
              <li key={toy.id} className="li-container">
                {toy.label} - {toy.price}€<button onClick={() => handleAddToBasket(toy.id)}>Ajouter au Panier</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
