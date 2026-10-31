
import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import UserProfilePage from '@/pages/account/UserProfilePage';

import { BonReceptionPage } from '@/pages/bon-reception';
import BonReceptionFormPage from '@/pages/bon-reception/BonReceptionFormPage';

import { AjouterCiternePage, CiternePage } from '@/pages/citernes';
import { ComptePage, AjouterComptePage } from '@/pages/comptes';
import FunctionsPage from '@/pages/fonctions/FunctionsPage';
import OilPurchasesPage from '@/pages/OilPurchasesPage';
import OilSalesPage from '@/pages/OilSalesPage';
import { AjouterOuvrierPage } from '@/pages/ouvriers';
import { OuvrierPage } from '@/pages/ouvriers/ouvrier-page';
import { WorkerPlanningsPage } from '@/pages/plannings-ouvriers';
import { AjouterSaisonPage, SaisonPage } from '@/pages/saison';
import { DashboardPage } from '@/pages/store-admin';
import DepartementsPage from '@/pages/store-admin/DepartementsPage';
import RubriquesPage from '@/pages/store-admin/RubriquesPage';
import WorkerAttendancesPage from '@/pages/store-admin/worker-attendances/WorkerAttendancesPage';
import TraitementBasesPage from '@/pages/traitement-bases/traitement-bases-page';
import { UtilisateurPage, AjouterUtilisateurPage } from '@/pages/utilisateurs';
import { VenteHuilePage } from '@/pages/vente-huile/vente-huile-page';

import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      {/* Authentification et espace administrateur */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route
            path="/"
            element={
              <Navigate
                to="/store-admin/dashboard"
                replace
              />
            }
          />

          {/* Tableau de bord */}
          <Route
            path="/store-admin/dashboard"
            element={<DashboardPage />}
          />

          {/* Saisons */}
          <Route
            path="/store-admin/saison"
            element={<SaisonPage />}
          />
          <Route
            path="/store-admin/saison/ajouter"
            element={<AjouterSaisonPage />}
          />

          {/* Citernes */}
          <Route
            path="/store-admin/tanks"
            element={<CiternePage />}
          />
          <Route
            path="/store-admin/tanks/ajouter"
            element={<AjouterCiternePage />}
          />

          {/* Utilisateurs */}
          <Route
            path="/store-admin/users"
            element={<UtilisateurPage />}
          />
          <Route
            path="/store-admin/users/ajouter"
            element={<AjouterUtilisateurPage />}
          />

          {/* Comptes */}
          <Route
            path="/store-admin/accounts"
            element={<ComptePage />}
          />
          <Route
            path="/store-admin/accounts/form"
            element={<AjouterComptePage />}
          />

          {/* Ouvriers */}
          <Route
            path="/store-admin/workers"
            element={<OuvrierPage />}
          />
          <Route
            path="/store-admin/worker-plannings"
            element={<WorkerPlanningsPage />}
          />

          {/* Bons de réception */}
          <Route
            path="/store-admin/reception-vouchers"
            element={<BonReceptionPage />}
          />
          <Route
  path="/store-admin/reception-vouchers/add"
  element={
    <BonReceptionFormPage
      mode="add"
      onSubmit={async (data, mode) => {
        console.log("Données :", data);
        console.log("Mode :", mode);
      }}
    />
  }
/>
          <Route
  path="/store-admin/reception-vouchers/edit/:id"
  element={
    <BonReceptionFormPage
      mode="edit"
      onSubmit={async (data, mode) => {
        console.log("Modification ID :", data);
        console.log("Mode :", mode);
      }}
    />
  }
/>

          {/* Traitement de base */}
          <Route
            path="/store-admin/traitement-bases"
            element={<TraitementBasesPage />}
          />

          <Route
  path="/store-admin/functions"
  element={<FunctionsPage />}
/>

<Route
  path="/store-admin/departements"
  element={<DepartementsPage />}
/>
<Route
  path="/store-admin/rubrics"
  element={<RubriquesPage />}
/>

<Route
  path="/store-admin/oil-sales"
  element={<OilSalesPage />}
/>

<Route
  path="/store-admin/oil-purchases"
  element={<OilPurchasesPage />}
/>
<Route
  path="/account/home/user-profile"
  element={<UserProfilePage />}
/>
<Route
  path="/store-admin/worker-attendances"
  element={<WorkerAttendancesPage />}
/>

          {/* Vente d'huile */}
          <Route
            path="/store-admin/oil-sales"
            element={<VenteHuilePage />}
          />
        </Route>
      </Route>

      {/* Routes publiques */}
      <Route
        path="auth/*"
        element={<AuthRouting />}
      />
      <Route
        path="error/*"
        element={<ErrorRouting />}
      />

      {/* Page introuvable */}
      <Route
        path="*"
        element={
          <Navigate
            to="/error/404"
            replace
          />
        }
      />
    </Routes>
  );
}
