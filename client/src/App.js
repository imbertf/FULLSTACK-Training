import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [getData, setGetData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: null,
  });
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [currentValues, setCurrentValues] = useState(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setGetData(data);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, imageUrl: file });
  };

  // create new recipe in DB
  const handleSubmit = async (event) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("imageUrl", formData.imageUrl);
    try {
      console.log(formDataToSend);
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        console.log("Recipe added successfully!");
      } else {
        console.log("Error adding recipe");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  // remove recipe from the DB
  let handleDelete = async (recipeID) => {
    try {
      await fetch(`/api/recipes/${recipeID}`, {
        method: "DELETE",
      });
      // Update the state by filtering out the deleted recipe
      setGetData([...getData].filter((recipe) => recipe._id !== recipeID));
    } catch (error) {
      console.log(error);
    }
  };

  // update recipe
  // filter data to get only the one selected by "modifier" button
  let handleUpdate = (recipeID) => {
    setOpenUpdateForm(!openUpdateForm);

    // get the Object and extract datas to stock to [currentValues] state
    const cardData = [...getData].filter((recipe) => recipe._id === recipeID);
    const title = cardData[0].title;
    const category = cardData[0].category;
    const imageUrl = cardData[0].imageUrl;
    const ID = cardData[0]._id;
    setCurrentValues({
      _id: ID,
      title: title,
      category: category,
      imageUrl: imageUrl,
    });
  };

  // open update form with previous data selected as default values
  const UpdateForm = (recipeID) => {
    // get values from [currentValues] state
    const [updatedRecipe, setUpdatedRecipe] = useState({ ...currentValues });

    // listen input change from new form and stock into [currentValues] state
    const handleUpdateChange = (event) => {
      const { name, value } = event.target;
      setUpdatedRecipe({ ...updatedRecipe, [name]: value });
    };

    // change imageUrl into [currentValues] state
    const handleUpdateImage = (event) => {
      const file = event.target.files[0];
      setUpdatedRecipe({ ...updatedRecipe, imageUrl: file });
    };

    // send modified recipe to DB
    let handleSubmitChanges = async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("title", updatedRecipe.title);
      formDataToSend.append("category", updatedRecipe.category);
      formDataToSend.append("imageUrl", updatedRecipe.imageUrl);
      try {
        const res = await fetch(`/api/recipes/${updatedRecipe._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
        if (res.ok) {
          console.log("Recipe added successfully!");
        } else {
          console.log("Error adding recipe");
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    // clean all data in state and close update form
    let cancelUpdate = () => {
      setFormData(null);
      setOpenUpdateForm(!openUpdateForm);
    };

    return (
      <section className="recipe_form">
        <form>
          <label htmlFor="title">Modifier le titre</label>
          <input
            type="text"
            name="title"
            value={updatedRecipe.title}
            onChange={handleUpdateChange}
          />
          <label htmlFor="category">Modifier la catégorie</label>
          <select
            id="category_options"
            name="category"
            value={updatedRecipe.category}
            onChange={handleUpdateChange}
          >
            <option value="" disabled>
              {updatedRecipe.category}
            </option>
            <option value="Entree">Entrée</option>
            <option value="Plat">Plat</option>
            <option value="Dessert">Dessert</option>
            <option value="Sauce">Sauce</option>
          </select>
          <label htmlFor="image">Choisisez une image</label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={handleUpdateImage}
          />
          <button onClick={handleSubmitChanges}>Valider</button>
          <button onClick={() => cancelUpdate()}>Annuler</button>
        </form>
      </section>
    );
  };

  return (
    <div className="container">
      <section className="recipe_form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Titre de la recette</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Entrez un titre"
            value={formData.title}
            onChange={handleChange}
          ></input>
          <label htmlFor="category_options">Choix de la catégorie</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choisisez la catégorie
            </option>
            <option value="Entree">Entrée</option>
            <option value="Plat">Plat</option>
            <option value="Dessert">Dessert</option>
            <option value="Sauce">Sauce</option>
          </select>
          <label htmlFor="image">Choisisez une image</label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={handleImageChange}
          />
          <button type="submit">Ajouter</button>
        </form>
      </section>
      <h2>Liste des recettes</h2>
      <section className="display_recipes">
        {getData.map((recipe, index) => (
          <div className="recipe_card" key={recipe._id}>
            <div className="title">{recipe.title}</div>
            <ul>
              <li>{recipe.category}</li>
            </ul>
            <div className="image">
              <img src={recipe.imageUrl} alt={recipe.title} />
            </div>
            <button type="submit" onClick={() => handleUpdate(recipe._id)}>
              Modifier
            </button>
            <button type="submit" onClick={() => handleDelete(recipe._id)}>
              Supprimer
            </button>
          </div>
        ))}
      </section>
      {openUpdateForm && <UpdateForm recipeID={currentValues._id} />}
      <section className="recipe_form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Nom de l'ingredient</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Entrez un nom"
            value={formData.title}
            onChange={handleChange}
          ></input>
          <label htmlFor="category_options">Choix de l'Unité</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choisisez le type d'unité
            </option>
            <option value="mg">mg</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="cl">cl</option>
            <option value="l">l</option>
            <option value="c-a-c">c à c</option>
            <option value="c-a-s">c à s</option>
            <option value="feuille">feuille(s)</option>
            <option value="piece">pièce(s)</option>
          </select>
          <label htmlFor="image">Choisisez une image</label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={handleImageChange}
          />
          <button type="submit">Ajouter</button>
        </form>
      </section>
      <h2>Liste des ingrédients</h2>
    </div>
  );
};

export default App;
