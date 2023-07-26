// Created by Vite Router https://www.npmjs.com/package/vite-plugin-router
// @ts-nocheck
// prettier-ignore
import React,{ lazy,Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const File1 = lazy(() => import('./app/admin'));
const File2 = lazy(() => import('./app/admin/product/details/[id]'));
const File3 = lazy(() => import('./app/admin/product/[id]'));
const File4 = lazy(() => import('./app/index'));

const AdminLayout = lazy(() => import('./app/admin/layout'));
const RootLayout = lazy(() => import('./app/layout'));

function Error404() {
  return <div>404</div>;
}

function Loading() {
  return <div>Loading...</div>;
}

interface IAppRoutesProps {
  custom404?: React.ReactNode;
  customLoading?: React.ReactNode;
}

export function AppRoutes({
  custom404: Custom404,
  customLoading: CustomLoading
}: IAppRoutesProps) {
  return (
    <BrowserRouter>
      <Suspense fallback={CustomLoading || <Loading />}>
        <Routes>
          <Route
            element={
              <AdminLayout>
                <File1 />
              </AdminLayout>
            }
            path="/admin"
            key="/admin"
          />

          <Route
            element={
              <AdminLayout>
                <File2 />
              </AdminLayout>
            }
            path="/admin/product/details/:id"
            key="/admin/product/details/:id"
          />

          <Route
            element={
              <AdminLayout>
                <File3 />
              </AdminLayout>
            }
            path="/admin/product/:id"
            key="/admin/product/:id"
          />

          <Route
            element={
              <RootLayout>
                <File4 />
              </RootLayout>
            }
            path="/"
            key="/"
          />
          <Route path="*" element={Custom404 || <Error404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
