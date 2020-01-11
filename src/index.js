import React from "react";
import ReactDOM from "react-dom";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import "./index.css";
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";
import configStore from "./app/store/configStore";
import ScrollToTop from "./app/common/util/scrollToTop";
//import { loadEvents } from "./features/event/eventActions";

const rootEl = document.getElementById("root");
const store = configStore();
//store.dispatch(loadEvents()); //store is able to dispatch actions

//console.log(store.getState());

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
          <ReduxToastr
            position="bottom-right"
            transtitionIn="fadeIn"
            transitionOut="fadeOut"
          />
          <App />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept("./app/layout/App", () => {
    setTimeout(render);
  });
}

store.firebaseAuthIsReady.then(() => {
  render();
});

//render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
