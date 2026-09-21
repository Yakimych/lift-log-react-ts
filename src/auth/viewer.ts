import * as React from "react";

/** Who is signed in, and whether they may create, rename or delete logs. */
export type Viewer = {
  email: string;
  name: string;
  isAdmin: boolean;
};

export const ViewerContext = React.createContext<Viewer | null>(null);

export const useViewer = (): Viewer | null => React.useContext(ViewerContext);

export const useIsAdmin = (): boolean => {
  const viewer = useViewer();
  return viewer !== null && viewer.isAdmin;
};
