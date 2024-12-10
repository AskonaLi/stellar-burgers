import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/slices/IngredientsSlice';
import { Preloader } from '@ui';

// Компонент-обертка, предназначен для описания логики отображения списка ингредиентов
export const BurgerIngredients: FC = () => {
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  // Фильтрация ингридиентов по их типу
  const buns = ingredients.filter((ingredient) => {
    if (ingredient.type === 'bun') {
      return ingredient;
    }
  });
  const mains = ingredients.filter((ingredient) => {
    if (ingredient.type === 'main') {
      return ingredient;
    }
  });
  const sauces = ingredients.filter((ingredient) => {
    if (ingredient.type === 'sauce') {
      return ingredient;
    }
  });

  // Текущее состояние выбранной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки для прокрутки по вкладкам
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Определяем текущую вкладку на основе видимой на экране секции
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик кликов по вкладкам
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
