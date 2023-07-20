import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './app'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Home />} />
      </Routes>
    </BrowserRouter>
  )
}
