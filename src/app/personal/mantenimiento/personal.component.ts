import { AuthService } from "src/app/personal/auth.service";
import { Subject } from "rxjs";
import { Component, NgZone, OnInit, OnDestroy } from "@angular/core";
import { Personal } from "../personal";
import { PersonalService } from "../personal.service";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.css"],
})
export class PersonalComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  personales: Personal[];
  personalIndex: Personal[];

  personalSeleccionado: Personal;
  private errores: string[];
  var: boolean = true;
  contador: number = 0;

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private personalService: PersonalService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private zone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
    };

    this.personalService.getPersonalesIndex().subscribe((personal) => {
      this.personalIndex = personal;

      this.dtTrigger.next();
    });

    //solo cuando se hace next()
    this.personalService.personalCambio.subscribe((data) => {
      this.personalIndex = data;
    });

    console.log("ngOnInit::::::::::::::::");
    console.log(this.personalIndex);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  reloadPage() {
    //click handler or similar
    this.zone.runOutsideAngular(() => {
      location.reload();
      this.contador = this.contador + 1;
    });
  }

  deleteLogico(personal: Personal): void {
    personal.per_estado = false;
    this.personalService.update(personal)
      /*dentro de subscribe, se registra el observador, que seria la respuesta en este caso el cliente*/
      .subscribe(json => {
          this.router.navigate(["/personal"]);
          Swal.fire( "Personal Inactivo",`${json.mensaje}: ${json.personal.per_nombre}`,"success");
          this.personalService.getPersonalesIndex().subscribe(data => {
            this.personalService.personalCambio.next(data);
          });
        },
        (err) => {
          this.errores = err.error.errors as string[];
          console.error("Código del error desde el backend" + err.status);
          console.error(err.error.errors);
        }
      );
  }
}
