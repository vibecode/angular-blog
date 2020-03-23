import { BrowserModule } from '@angular/platform-browser'
import { NgModule, Provider } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageComponent } from './home-page/home-page.component'
import { PostPageComponent } from './post-page/post-page.component'
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component'
import { AdminModule } from './admin/admin.module'
import { PostComponent } from './shared/components/post/post.component'
import { SharedModule } from './admin/shared/shared.module'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './admin/shared/services/auth.interceptor'
import { registerLocaleData } from '@angular/common'
import RU_LOCALE from '@angular/common/locales/ru';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'

registerLocaleData(RU_LOCALE, 'ru')

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PostPageComponent,
    MainLayoutComponent,
    PostComponent
  ],
  imports: [BrowserModule, AppRoutingModule, SharedModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {}
