import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

function* rootSaga() {
    yield takeEvery('FETCH_FAVORITES', fetchFavorites);
}

function* fetchFavorites() {
    try {
      const favoritesResponse = yield axios.get('/api/favorites');
      yield put({
        type: 'SET_FAVORITES',
        payload: favoritesResponse.data
      });
    } catch (error) {
      console.log('fetchFavorites error:', error);
    }
  }

const sagaMiddleware = createSagaMiddleware();

  const favorites = (state = [], action) => {
    switch (action.type) {
      case 'SET_FAVORITES':
        return action.payload;
      default:
        return state;
    }
  }

const storeInstance = createStore(
    combineReducers({
        favorites,
    }),
    applyMiddleware(sagaMiddleware, logger),
  );
  
  sagaMiddleware.run(rootSaga);
  
  export default storeInstance;