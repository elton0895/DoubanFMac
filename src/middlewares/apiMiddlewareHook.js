import { compose } from 'redux';
import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { decamelizeKeys } from 'humps';
import _transform from 'lodash/transform';
import _join from 'lodash/join';
import _isPlainObject from 'lodash/isPlainObject';
import _includes from 'lodash/includes';
import {
  FETCH_REQUEST as CHANNEL_FETCH_REQUEST,
  BAN_REQUEST as CHANNEL_BAN_REQUEST,
  REFUSE as CHANNEL_REFUSE,
} from '../reducers/channel';
import {
  BAN_REQUEST as FAVORITE_BAN_REQUEST,
  REFUSE as FAVORITE_REFUSE,
} from '../reducers/favorite';

const decamelizeBody = (action) => {
  const callAPI = action[CALL_API];
  const { body } = callAPI;

  if (!body) return action;

  return {
    ...action,
    [CALL_API]: {
      ...callAPI,
      body: decamelizeKeys(body)
    }
  };
};

const serializeFormBody = (action) => {

  const callAPI = action[CALL_API];
  const { body, headers } = callAPI;

  if (!body || headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
    return action;
  }

  /* eslint no-param-reassign: 0*/
  const fieldsArray = _transform(body, (result, value, key) => {
    result.push(`${key}=${encodeURIComponent(value)}`);
  }, []);

  return {
    ...action,
    [CALL_API]: {
      ...callAPI,
      body: _join(fieldsArray, '&'),
    }
  };
};

const stringifyJsonBody = (action) => {
  const callAPI = action[CALL_API];
  const { body } = callAPI;

  if (!body || !_isPlainObject(body)) return action;

  return {
    ...action,
    [CALL_API]: {
      ...callAPI,
      body: JSON.stringify(body),
    }
  };
};

const pendingRefuse = (action, store) => {
  if (!store) return action;

  const callAPI = action[CALL_API];
  if (_includes([CHANNEL_FETCH_REQUEST, CHANNEL_BAN_REQUEST], callAPI.types[0])) {
    if (store.getState().channel.loading) return { type: CHANNEL_REFUSE };
  }
  if (FAVORITE_BAN_REQUEST === callAPI.types[0]) {
    if (store.getState().favorite.loading) return { type: FAVORITE_REFUSE };
  }

  return action;
};

export default store => next => action => {
  let newAction = action;

  if (isValidRSAA(action)) {
    newAction = pendingRefuse(action, store);
    if (!isValidRSAA(newAction)) return next(newAction);

    newAction = compose(
       pendingRefuse, stringifyJsonBody, serializeFormBody, decamelizeBody
    )(newAction);
  }

  return next(newAction);
};