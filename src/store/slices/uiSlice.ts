// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  darkMode: boolean;
  search: string;
  filter: {
    categoryId: number | null;
    sortBy: string;
    status: string | null; // untuk filter loan / book status
  };
}

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) return saved === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState: UiState = {
  sidebarOpen: true,
  darkMode: getInitialDarkMode(),
  search: '',
  filter: {
    categoryId: null,
    sortBy: 'newest',
    status: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));

      // Apply ke <html>
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(action.payload));

      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setFilter: (state, action: PayloadAction<Partial<UiState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    resetFilter: (state) => {
      state.filter = {
        categoryId: null,
        sortBy: 'newest',
        status: null,
      };
      state.search = '';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
  setSearch,
  setFilter,
  resetFilter,
} = uiSlice.actions;

export default uiSlice.reducer;
