import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [getData, setGetData] = useState([]);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("");
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [currentValues, setCurrentValues] = useState(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setGetData(data);
      });
  }, []);

  // create new recipe in DB
  let handleCreate = async (event) => {
    try {
      fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${recipeTitle}`,
          category: `${recipeCategory}`,
        }),
      });
    } catch (error) {
      console.log(error);
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
    const ID = cardData[0]._id;
    setCurrentValues({ _id: ID, title: title, category: category });
  };

  // open update form with previous data selected as default values
  const UpdateForm = () => {
    // get values from [currentValues] state
    const [updatedRecipe, setUpdatedRecipe] = useState({ ...currentValues });

    // listen input change from new form and stock into [currentValues] state
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUpdatedRecipe({ ...updatedRecipe, [name]: value });
    };

    // send modified recipe to DB
    let handleSave = async () => {
      try {
        fetch(`/api/recipes/${updatedRecipe._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: `${updatedRecipe._id}`,
            title: `${updatedRecipe.title}`,
            category: `${updatedRecipe.category}`,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };

    // clean all data in state and close update form
    let cancelUpdate = () => {
      setCurrentValues(null);
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
            onChange={handleInputChange}
          />
          <label htmlFor="category">Modifier la catégorie</label>
          <select
            id="category_options"
            name="category"
            value={updatedRecipe.category}
            onChange={handleInputChange}
          >
            <option value="">{updatedRecipe.category}</option>
            <option value="Entree">Entrée</option>
            <option value="Plat">Plat</option>
            <option value="Dessert">Dessert</option>
            <option value="Sauce">Sauce</option>
          </select>
          <button onClick={() => handleSave()}>Valider</button>
          <button onClick={() => cancelUpdate()}>Annuler</button>
        </form>
      </section>
    );
  };

  return (
    <div className="container">
      <section className="recipe_form">
        <form onSubmit={handleCreate}>
          <label htmlFor="title">Titre de la recette</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Entrez un titre"
            value={recipeTitle}
            onChange={(event) => setRecipeTitle(event.target.value)}
          ></input>
          <label htmlFor="category_options">Choix de la catégorie</label>
          <select
            id="category_options"
            value={recipeCategory}
            onChange={(event) => setRecipeCategory(event.target.value)}
          >
            <option value="">Choisisez la catégorie</option>
            <option value="Entree">Entrée</option>
            <option value="Plat">Plat</option>
            <option value="Dessert">Dessert</option>
            <option value="Sauce">Sauce</option>
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </section>
      <section className="display_recipes">
        {getData.map((recipe, index) => (
          <div className="recipe_card" key={recipe._id}>
            <div className="title">{recipe.title}</div>
            <ul>
              <li>{recipe.category}</li>
            </ul>
            <button type="submit" onClick={() => handleUpdate(recipe._id)}>
              Modifier
            </button>
            <button type="submit" onClick={() => handleDelete(recipe._id)}>
              Supprimer
            </button>
          </div>
        ))}
      </section>
      {openUpdateForm && <UpdateForm />}
    </div>
  );
};

export default App;
