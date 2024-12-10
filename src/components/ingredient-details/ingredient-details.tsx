import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getIngredientsSelector } from '../../services/slices/IngredientsSlice';
import styles from '../app/app.module.css';

// Компонент-обертка для отображения подробной информации о выбранном ингредиенте
export const IngredientDetails: FC = () => {
  const ingredients = useSelector(getIngredientsSelector);

  // Извлечение параметра id из URL
  const { id } = useParams();

  // Поиск данных ингредиента по id
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={styles.detailPageWrap}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
