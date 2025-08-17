@@ .. @@
 import { provideRouter } from '@angular/router';
 import { provideHttpClient, withInterceptors } from '@angular/common/http';
 import { importProvidersFrom } from '@angular/core';
 import { ReactiveFormsModule } from '@angular/forms';
+import { provideAnimations } from '@angular/platform-browser/animations';
 import { AppComponent } from './app/app.component';
 import { routes } from './app/app.routes';
 import { authInterceptor } from './app/core/interceptors/auth.interceptor';

 bootstrapApplication(AppComponent, {
   providers: [
     provideRouter(routes),
     provideHttpClient(withInterceptors([authInterceptor])),
+    provideAnimations(),
     importProvidersFrom(ReactiveFormsModule)
   ]
 }).catch(err => console.error(err));