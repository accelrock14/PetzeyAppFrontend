import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl:'./home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  idToken!: string;
  constructor(private route: ActivatedRoute,private auth: AuthService,private router: Router) {

  }
  ngOnInit(): void {
    if(this.route.fragment)
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          const params = new URLSearchParams(fragment);
          this.idToken = params.get('id_token')!;
          if(this.idToken){
            this.auth.storeToken(this.idToken);
            this.router.navigate(['/']);
          }
        }
      });
  }



}
