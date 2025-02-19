// STATE
export interface AppStateDefinition {
  isSidebarOpen: boolean;
}

// ACTIONS
export interface AppStateActions {
  toggleIsSidebarOpen: (open: boolean) => void;
}
