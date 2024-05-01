import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

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
    // Subscribe to route params to get the id_token
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        this.idToken = params.get('id_token')!;
        if(this.idToken){
          this.auth.storeToken(this.idToken);
          this.router.navigate(['/profile']);
        }
      }
    });
  }
}