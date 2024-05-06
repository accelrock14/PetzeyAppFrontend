import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { TokenDTO } from '../../../models/User-Authentication/TokenDTO';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  idToken!: string;

  constructor(private route: ActivatedRoute,private auth: AuthService,private router: Router,) { }

  ngOnInit(): void {
    if(this.route.fragment)
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        this.idToken = params.get('id_token')!;
        if(this.idToken){
          this.auth.storeToken(this.idToken);
          const user = this.auth.getLoggedInUserObject()
          const tokenObj:TokenDTO = {
            UID: user.oid,
            Name: user.name,
            Role: user.extension_role
          }
          this.auth.storeJWTToken(tokenObj);
          this.router.navigate(['/profile']);
        }
      }
    });
  }
}
