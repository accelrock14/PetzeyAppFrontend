import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';
import { Toast } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl:'./home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  idToken!: string;
 
  constructor(private route: ActivatedRoute,private auth: AuthService,private router: Router,private vetService:VetsserviceService,private toastr:ToastrService) {

    
  }
 
  ngOnInit(): void {
    this.reloadOnce()
      
    console.log("ngOnit called");
 
    // const flag=localStorage.getItem('reloadFlag')
    // if(!flag){
    //   window.location.reload()
    //   localStorage.setItem('reloadFlag',"true")
    // }
    
    

    this.decideDestiny();
  
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

  reloadOnce(): void {
    console.log("Reload called");
    const flag=localStorage.getItem("reloadOnce")
 
  
    if(!flag){
      console.log("flag set to true");
      
      localStorage.setItem("reloadOnce","true")
      window.location.reload()
 
    }
    
    
    
  }

  validDoctor:boolean=false
  errorMessage:string=""
 

  decideDestiny():void{
    
    
    if(this.auth.isLoggedIn()){
     
      
      if(this.auth.getRoleFromToken()=="Doctor"){
       

        
        
        this.vetService.checkNpi(this.auth.getVPIFromToken()).subscribe({
          next:(res)=>{

            console.log(res);
           
            
            this.validDoctor=res
      


          },
          error:(err)=>{

            console.log(err.error.Message);
            this.errorMessage=err
            this.auth.logOut()
            this.router.navigate(['/signin'])
            this.toastr.error(err.error.Message)

          }


          })       
        
      }
    }
  }
}
