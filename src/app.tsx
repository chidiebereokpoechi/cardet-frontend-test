import { observer } from "mobx-react";
import React from "react";
import {
  GameCanvas,
  GameRouter,
  Loader,
  LoaderOverlay,
  Stylesheet,
} from "./components";
import { rootState } from "./modules/root";

export const App: React.FC = observer(() => {
  const ready = rootState.ready;

  return (
    <React.Fragment>
      <Stylesheet />
      <GameCanvas>
        {rootState.loading && <LoaderOverlay />}
        {ready ? <GameRouter /> : <Loader />}
      </GameCanvas>
    </React.Fragment>
  );
});
