import { createContext, useContext, useState } from "react";

const DenunciaContext = createContext(null);

export function DenunciaProvider({ children }) {
  const [photos, setPhotos] = useState([]); // [{ file, preview }]
  const [category, setCategory] = useState(null);
  const [details, setDetails] = useState("");
  const [bairro, setBairro] = useState("");
  const [local, setLocal] = useState(null); // { lat, lng, endereco }

  function limpar() {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setCategory(null);
    setDetails("");
    setBairro("");
    setLocal(null);
  }

  return (
    <DenunciaContext.Provider
      value={{ photos, setPhotos, category, setCategory, details, setDetails,
               bairro, setBairro, local, setLocal, limpar }}
    >
      {children}
    </DenunciaContext.Provider>
  );
}

export function useDenuncia() {
  return useContext(DenunciaContext);
}