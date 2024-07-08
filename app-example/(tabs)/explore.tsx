import { nanoid } from 'nanoid/non-secure';
import BaseRouter from './BaseRouter';
export const StackActions = {
  replace(name, params) {
    return {
      type: 'REPLACE',
      payload: {
        name,
        params
      }
    };
  },
  push(name, params) {
    return {
      type: 'PUSH',
      payload: {
        name,
        params
      }
    };
  },
  pop() {
    let count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return {
      type: 'POP',
      payload: {
        count
      }
    };
  },
  popToTop() {
    return {
      type: 'POP_TO_TOP'
    };
  }
};
export default function StackRouter(options) {
  const router = {
    ...BaseRouter,
    type: 'stack',
    getInitialState(_ref) {
      let {
        routeNames,
        routeParamList
      } = _ref;
      const initialRouteName = options.initialRouteName !== undefined && routeNames.includes(options.initialRouteName) ? options.initialRouteName : routeNames[0];
      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: 0,
        routeNames,
        routes: [{
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        }]
      };
    },
    getRehydratedState(partialState, _ref2) {
      let {
        routeNames,
        routeParamList
      } = _ref2;
      let state = partialState;
      if (state.stale === false) {
        return state;
      }
      const routes = state.routes.filter(route => routeNames.includes(route.name)).map(route => ({
        ...route,
        key: route.key || `${route.name}-${nanoid()}`,
        params: routeParamList[route.name] !== undefined ? {
          ...routeParamList[route.name],
          ...route.params
        } : route.params
      }));
      if (routes.length === 0) {
        const initialRouteName = options.initialRouteName !== undefined ? options.initialRouteName : routeNames[0];
        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        });
      }
      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: routes.length - 1,
        routeNames,
        routes
      };
    },
    getStateForRouteNamesChange(state, _ref3) {
      let {
        routeNames,
        routeParamList,
        routeKeyChanges
      } = _ref3;
      const routes = state.routes.filter(route => routeNames.includes(route.name) && !routeKeyChanges.includes(route.name));
      if (routes.length === 0) {
        const initialRouteName = options.initialRouteName !== undefined && routeNames.includes(options.initialRouteName) ? options.initialRouteName : routeNames[0];
        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        });
      }
      return {
        ...state,
        routeNames,
        routes,
        index: Math.min(state.index, routes.length - 1)
      };
    },
    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);
      if (index === -1 || index === state.index) {
        return state;
      }
      return {
        ...state,
        index,
        routes: state.routes.slice(0, index + 1)
      };
    },
    getStateForAction(state, action, options) {
      const {
        routeParamList
      } = options;
      switch (action.type) {
        case 'REPLACE':
          {
            const index = action.target === state.key && action.source ? state.routes.findIndex(r => r.key === action.source) : state.index;
            if (index === -1) {
              return null;
            }
            const {
              name,
              key,
              params
            } = action.payload;
            if (!state.routeNames.includes(name)) {
              return null;
            }
            return {
              ...state,
              routes: state.routes.map((route, i) => i === index ? {
                key: key !== undefined ? key : `${name}-${nanoid()}`,
                name,
                params: routeParamList[name] !== undefined ? {
                  ...routeParamList[name],
                  ...params
                } : params
              } : route)
            