import React, { useEffect, useState } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setDataBasket } from '../../../redux/slices/dataStorageSlice';
// Check Types
import PropTypes from 'prop-types';
// Auxiliary Functions
import dataForm from '../../../auxiliary-functions/dataform';
// Swiper-Slider
import { SwiperSlide } from 'swiper/react';
// Components
import Skeleton from '../../common/Skeleton';
import Slider from '../../common/Slider';
import Price from '../../common/Price';
import Card from '../../common/ProductCard';
import Show from '../../common/Show';
import Amount from '../../common/Amount';
import SkeletonIcon from './SkeletonIcon';
import RadioCkeckbox from './RadioCkeckbox';
// Styles
import product from './product.module.scss';

const Product = ({ loading, API, id }) => {
  // Redux
  const dispatch = useDispatch();
  const localStorage = useSelector(
    (state) => state.clothesStorage.data.filter((obj) => obj.id === id)[0]
  );
  // React State
  const [productStorage, setProductStorage] = useState({});
  // React Effect
  useEffect(() => {
    setProductStorage(localStorage ? localStorage : {});
  }, [id, localStorage]);
  // Submit Form
  const addToBasket = (e) => {
    e.preventDefault();

    let data = {
      id: API.id,
      category: API.category,
      name: API.name,
      src: API.src.main,
      price: API.price.new ? API.price.new : API.price.current,
      basket: true,
      ...dataForm(e.currentTarget),
    };

    dispatch(
      setDataBasket({
        option: {
          key: 'basket-elegance',
          method: e.nativeEvent.submitter.dataset.method,
          product: data,
        },
      })
    );
  };

  return (
    <div className={product.main}>
      <div className={product.content}>
        <Show name={API.name} src={API.src} className={product} />
        {loading && API.id !== id ? (
          <Skeleton
            option={{
              width: 348,
              height: 510,
            }}
            content={<SkeletonIcon />}
          />
        ) : (
          <form className={product.form} onSubmit={(e) => addToBasket(e)}>
            <Price
              prop={{ current: API.price.current, discount: API.price.new }}
              cssModule={product}
            />
            <RadioCkeckbox
              name="size"
              data={API.sizes}
              productDataBasket={productStorage}
              active={productStorage.size}
            />
            <RadioCkeckbox
              name="color"
              data={API.colors}
              productDataBasket={productStorage}
              active={productStorage.color}
            />
            <div className={product.form__box_amount}>
              <Amount
                value={
                  productStorage.amount ? productStorage.amount : API.amount
                }
                productID={productStorage.id}
                cssClasses={[product.form__input]}
              />
              <div className={product.form__box_btn}>
                {[
                  { method: 'DELETE', desc: 'Удалить из корзины' },
                  { method: 'POST', desc: 'Добавить в корзину' },
                ].map(
                  ({ method, desc }, index) =>
                    (productStorage.basket
                      ? method === 'DELETE'
                      : method === 'POST') && (
                      <button
                        key={`product-btn-${index + 1}`}
                        name="method"
                        className={product.form__btn}
                        data-method={method}
                      >
                        {desc}
                      </button>
                    )
                )}
              </div>
            </div>
          </form>
        )}
      </div>
      <div>
        <h2 className={product.title__products}>Связанные товары</h2>
        <div className={product.slider__container}>
          <Slider
            option={{
              pagination: {
                el: `.${product.slider__pagination}`,
                bulletClass: product.slider__pagination_bullet,
                bulletActiveClass: product.slider__pagination_bullet__active,
                clickable: true,
              },
              navigation: {
                prevEl: '.swiper__product_btn-prev',
                nextEl: '.swiper__product_btn-next',
              },
              spaceBetween: 30,
              slidesPerView: 3,
              slidesPerGroup: 3,
              breakpoints: {
                1070: {
                  spaceBetween: 30,
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                767: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 16,
                },
                100: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  allowTouchMove: true,
                },
              },
            }}
            additionalСssClass={[product.slider]}
            content={(loading ? [...new Array(3)] : API.products).map(
              (item, index) => (
                <SwiperSlide key={`product-slide-${index + 1}`}>
                  <Card {...item} />
                </SwiperSlide>
              )
            )}
          />
        </div>
      </div>
    </div>
  );
};

Product.propTypes = {
  loading: PropTypes.bool,
  API: PropTypes.object,
  id: PropTypes.string,
};

export default Product;
