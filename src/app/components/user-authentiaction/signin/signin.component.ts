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
  }
}
