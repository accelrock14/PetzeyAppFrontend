import { Component, OnInit } from '@angular/core';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { CommonModule } from '@angular/common';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthService } from '../../../services/UserAuthServices/auth.service';


@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule,FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.css'
})
export class VetComponent implements OnInit{


  vets: IVetCardDTO[] = [];
  filteredVets: IVetCardDTO[]=[];
  activeVets:IVetCardDTO[]=[];
  searchQuery: string = '';
  topRatedVets:IVetCardDTO[]=[];
  specialties: string[] = [];
  selectedSpecialties: string[] = [];
  fVets: any[] = [];
  dropdownSettings = {};
  currentPage: number = 1;
  pageSize: number = 4; 
  totalPages: number = 1; 
  totalActivePages: number=0;
  
 
  constructor(private vetService: VetsserviceService,private router: Router,  public auth : AuthService) { 
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      itemsShowLimit: 3,
      allowSearchFilter: false,
      maxHeight	: 500
    };
  }

  ngOnInit(): void {
    this.getTopRated();
    this.getAllVets();
    this.sFilterVet();
    this.updateFilteredVets(); 
    
  }

  getTopRated(): void {
    this.vetService.getTopRatedVets()
      .subscribe(
        (vets: IVetCardDTO[]) => {
          this.topRatedVets = vets;
          console.log(this.topRatedVets)
        },
        error => {
          console.error('Error fetching vets:', error);
        }
      );
    
  }

  getAllVets(): void {
    this.vetService.getAllVets()
      .subscribe(
        (vets: IVetCardDTO[]) => {
          this.vets = vets;
          this.filteredVets = [...this.vets];
          this.totalPages = Math.ceil(this.vets.length / this.pageSize);
          console.log(this.vets);
          for(const v of this.filteredVets){
            if(v.Status){
              this.activeVets.push(v);
            }
          }
          this.totalActivePages=Math.ceil(this.activeVets.length/this.pageSize)
          console.log("Active vets",this.activeVets)
          this.updateFilteredVets();
          
        },
        error => {
          console.error('Error fetching all vets:', error);
        }
      );
      
  }
  openVetProfile(id: number): void {
    
      this.router.navigate(['/vet-profile', id]);
     
      
    }
    filterVets(): void {
      // Filter vets based on the searchQuery
      if (this.searchQuery.trim() === '') {
        // If the search query is empty, display all vets
        this.filteredVets = [...this.vets];
      } else {
        this.filteredVets = this.vets.filter(vet =>
          vet.Name.toLowerCase().includes (this.searchQuery.toLowerCase()) ||
          vet.Speciality.toLowerCase().includes (this.searchQuery.toLowerCase()) 
        );
      }
      this.currentPage = 1; // Reset to first page
      this.totalPages = Math.ceil(this.filteredVets.length / this.pageSize);
      this.updateFilteredVets();
    }
    

    sFilterVet() :void{
      this.vetService.getUniqueSpecialties().subscribe({
        next: (data) => {
          this.specialties = data;
          console.log(this.specialties)
        },
        error: (err) => console.error(err)
      });
    }
    
    onSpecialtyChange(specialty: string, event: Event): void {
      const checkbox = event.target as HTMLInputElement; // Type assertion here
      if (checkbox.checked) {
        this.selectedSpecialties.push(specialty);
      } else {
        const index = this.selectedSpecialties.indexOf(specialty);
        if (index > -1) {
          this.selectedSpecialties.splice(index, 1);
        }
      }
      this.filteringVets();
    }
    


    filteringVets(): void {
      if (this.selectedSpecialties.length > 0) {
        this.vetService.getVetsBySpecialty(this.selectedSpecialties).subscribe({
          next: (vets) => {
            this.fVets = vets;
            this.currentPage = 1;
            console.log(this.fVets)
            //  this.totalPages = Math.ceil(this.fVets.length / this.pageSize);
             this.totalPages=1
            this.updateFilteredVets(); 
          },
          
          error: (err) => console.error(err)
        });
      } else {
        this.fVets = [...this.vets];
        this.currentPage = 1;
        this.totalPages=1;
        // this.totalPages = Math.ceil(this.fVets.length / this.pageSize); 
        this.updateFilteredVets();
      }
    }

    selectall(){
      console.log("select all selected");
       this.vetService.getAllVets().subscribe({
        next:(vets)=>{
          this.fVets=vets;
        }
      });
       this.totalPages=1
      // this.totalPages = Math.ceil(this.fVets.length / this.pageSize);
        this.updateFilteredVets();
      
    }
    unselectall(){
      
      console.log("unselect called");
      this.totalPages = Math.ceil(this.fVets.length / this.pageSize);
        this.updateFilteredVets();
      
      
    }
    

    updateFilteredVets(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.filteredVets = this.vets.filter(vet =>
        vet.Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vet.Speciality.toLowerCase().includes(this.searchQuery.toLowerCase())||vet.City.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(startIndex, endIndex);
      this.activeVets = this.vets.filter(vet =>
        vet.Status&&(
        vet.Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vet.Speciality.toLowerCase().includes(this.searchQuery.toLowerCase())||vet.City.toLowerCase().includes(this.searchQuery.toLowerCase()))
      ).slice(startIndex, endIndex);
    }

    get totalPagesArray(): number[] {
      return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    get totalActivePagesArray(): number[] {
      return Array(this.totalActivePages).fill(0).map((x, i) => i + 1);
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.updateFilteredVets();
    }

    navigateToAddVet() {
      this.router.navigate(['/add-vet']);
    }
  }

