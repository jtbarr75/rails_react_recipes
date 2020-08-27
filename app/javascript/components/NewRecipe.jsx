import React from 'react';
import { withRouter } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

class NewRecipe extends React.Component {
  render() {
    return (
      <RecipeForm method="POST" url="/api/v1/recipes/create" headline="Add a new recipe to our awesome recipe collection."/>
    )
  }
}

export default withRouter(NewRecipe)