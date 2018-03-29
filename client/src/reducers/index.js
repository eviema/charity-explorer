import {combineReducers} from 'redux';
import charitiesReducer from './charitiesReducer';

export default combineReducers({
    charities: charitiesReducer
});