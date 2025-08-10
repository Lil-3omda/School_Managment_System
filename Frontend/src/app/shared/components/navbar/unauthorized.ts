import { Component } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    template: `
        <div class="container mt-5">
        <div class="alert alert-danger text-center">
            <h4>غير مصرح لك بالوصول إلى هذه الصفحة</h4>
        </div>
        </div>
    `
})
export class UnauthorizedComponent {}
