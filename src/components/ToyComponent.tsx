

import React, { useState } from 'react';
import { ToyInterface } from '../interfaces/ToyInterfaces';

interface ToyFormProps {
    onSubmit: (toy: ToyInterface) => void;
    onDelete?: (id: number) => void;
    initialToy?: ToyInterface;
  }
  
  const ToyForm: React.FC<ToyFormProps> = ({ onSubmit, onDelete, initialToy }) => {
    const [toy, setToy] = useState<ToyInterface>(initialToy || { id: 0, label: '', year: '', price: 0 });
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(toy);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" value={toy.label} onChange={e => setToy({ ...toy, label: e.target.value })} placeholder="Label du jouet" />
        <input type="text" value={toy.year} onChange={e => setToy({ ...toy, year: e.target.value })} placeholder="Année du jouet" />
        <input type="number" value={toy.price} onChange={e => setToy({ ...toy, price: Number(e.target.value) })} placeholder="Prix du jouet" />
        <button type="submit">Enregistrer</button>
        {onDelete && <button type="button" onClick={() => onDelete(toy.id)}>Supprimer</button>}
      </form>
    );
  };
  
  export default ToyForm;