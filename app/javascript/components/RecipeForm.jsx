import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class RecipeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipe: {
        name: "",
        ingredients: "",
        instruction: ""
      }
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    if (id) {
      console.log("edit")
      const url = `/api/v1/show/${id}`;
      fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response not ok.");
      })
      .then(response => this.setState({ recipe: response }))
      .catch(() => this.props.history.push("/recipes"));
    }
  }

  // strip html entities to prevent storage of raw html in the db
  stripHtmlEntities(str) {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  onChange(event) {
    this.setState({ recipe: { ...this.state.recipe, [event.target.name]: event.target.value } });
  }

  onSubmit(event) {
    event.preventDefault();
    const  { url, method }  = this.props;
    const { recipe } = this.state;

    if (recipe.name.length == 0 || recipe.ingredients.length == 0 || recipe.instruction.length == 0)
      return;

    const body = {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instruction: this.stripHtmlEntities(recipe.instruction.replace(/\n/g, "<br>"))
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: method,
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response not ok.")
      })
      .then(response => this.props.history.push(`/recipe/${response.id}`))
      .catch(error => console.log(error.message));
  }

  render() {
    const { recipe } = this.state;
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Add a new recipe to our awesome recipe collection.
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="recipeName">Recipe name</label>
                <input
                  type="text"
                  name="name"
                  id="recipeName"
                  className="form-control"
                  required
                  onChange={this.onChange}
                  value={recipe.name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeIngredients">Ingredients</label>
                <input
                  type="text"
                  name="ingredients"
                  id="recipeIngredients"
                  className="form-control"
                  required
                  onChange={this.onChange}
                  value={this.state.recipe.ingredients}
                />
                <small id="ingredientsHelp" className="form-text text-muted">
                  Separate each ingredient with a comma.
                </small>
              </div>
              <label htmlFor="instruction">Preparation Instructions</label>
              <textarea
                className="form-control"
                id="instruction"
                name="instruction"
                rows="5"
                required
                onChange={this.onChange}
                value={recipe.instruction}
              />
              <button type="submit" className="btn custom-button mt-3">
                Create Recipe
              </button>
              <Link to="/recipes" className="btn btn-link mt-3">
                Back to recipes
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RecipeForm)