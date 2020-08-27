import React from 'react';
import { withRouter } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

class EditRecipe extends React.Component {
  render() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    return (
      <RecipeForm method="PATCH" url={`/api/v1/update/${id}`} />
    )
  }
}

export default withRouter(EditRecipe)