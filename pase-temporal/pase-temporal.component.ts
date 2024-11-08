import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pase-temporal',
  templateUrl: './pase-temporal.component.html',
  styleUrls: ['./pase-temporal.component.css']
})
export class PaseTemporalComponent implements OnInit, OnDestroy {
  private apiUrl = 'https://localhost:44397';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; // Obtiene el token de la URL

      if (token && token !== '') {
        this.eliminarToken(token);
      } else {
        Swal.fire({
          title: 'No pudimos obtener el token de tu invitación',
          text: 'Por favor contacta con la persona que te invitó',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  borrarToken(token: string): Observable<any> {
    const url = `${this.apiUrl}/api/Whatsapp/Borrar_Token?token=${token}`;
    return this.http.delete(url, { observe: 'response', responseType: 'text' });
  }

  eliminarToken(token: string) {
    this.borrarToken(token).subscribe(
      response => {
        if (response.status === 200) {
          Swal.fire({
            title: 'Genial, haz entrado a la comunidad',
            text: '',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else if (response.status === 400) {
          Swal.fire({
            title: 'Error',
            text: 'Vaya... parece que la invitación que intentas utilizar ya fue utilizada o nunca se registró...',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Vaya... parece que la invitación que intentas utilizar ya fue utilizada o nunca se registró...',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
}
