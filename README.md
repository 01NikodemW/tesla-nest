# Techniczne podsumowanie projektu

## Architektura i organizacja kodu
**Monolit z modularną architekturą** – każdy moduł ma swój **kontroler, serwis, DTO i encję**, co zapewnia **separację odpowiedzialności** i **łatwość rozbudowy**.  
**Zarządzanie konfiguracją** – centralizacja ustawień w `config/*.ts`, z użyciem **`ConfigModule`** i dynamicznej walidacji `.env` za pomocą **`enviroment.validation.ts`**.  
**Middleware do logowania zdarzeń** – własne middleware (`logger.middleware.ts`), pozwalające na audyt zapytań.  

---

## Autoryzacja i zarządzanie użytkownikami
**Autoryzacja JWT** – zabezpieczenie API za pomocą **JWT + Guardy**, z osobnymi strategiami:  
   - **LocalStrategy** – obsługa logowania po `email` + `password`.  
   - **JwtStrategy** – walidacja i rozkodowanie tokenów JWT.  
**RBAC (Role-Based Access Control)** – dekorator **`@Roles()`**, który weryfikuje uprawnienia użytkownika (np. `Admin`, `User`).  
**Customowe Guardy** – `RolesGuard`, `JwtAuthGuard`, `LocalAuthGuard` działające na **`CanActivate`**.  
**Moduł użytkowników** – użytkownicy są przechowywani w bazie (`users.entity.ts`), a ich dane są hashowane.  

---

## Integracje z zewnętrznymi usługami
**Azure Blob Storage** – przechowywanie i pobieranie plików w **chmurze Microsoft Azure** (`azure-storage.service.ts`).  
**Płatności Stripe** – obsługa płatności przez Stripe (`stripe.service.ts`):  
   - Tworzenie **PaymentIntent** (`create-payment-intent.dto.ts`).  
   - Obsługa webhooków (`webhook.controller.ts`).  
   - **Obsługa wyjątków Stripe** w dedykowanym filtrze (`stripe-exception.filter.ts`).  

---

## Zarządzanie pojazdami i rezerwacjami
**Moduł pojazdów** – obsługa dodawania, usuwania i edycji pojazdów (`vehicles.service.ts`).    
**Moduł rezerwacji** – obsługa cyklu życia rezerwacji (`reservations.service.ts`).  
**Cron Jobs** – zadania cykliczne w `reservation-cron.service.ts`, np. **czyszczenie starych rezerwacji**.  

---

## Obsługa wyjątków i bezpieczeństwo
**Globalne filtry wyjątków** – np. `reservation-conflict.exception.ts` dla konfliktów rezerwacji.  
**Soft delete** – encja `base-entity-soft-delete.ts`, implementująca usuwanie logiczne zamiast fizycznego.  
**Rate Limiting i zabezpieczenia** – możliwość wprowadzenia `ThrottleGuard`, ale nie widać go jeszcze w kodzie.  

---

## Dodatkowe techniczne aspekty
**Paginacja** – własny serwis paginacji `pagination.service.ts`, oparty na DTO.  
**Seeder bazy danych** – `seed.service.ts` do wstępnego wypełniania tabel testowymi danymi.  
**Dynamiczne logowanie do plików** – przechowywanie logów w `logs/YYYY-MM-DD/app.log`.  

